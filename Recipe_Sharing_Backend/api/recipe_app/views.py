from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from .models import Recipe, Comment, Bookmark, Feedback, Rating, Ingredient
from .serializers import RecipeSerializer,CommentSerializer,BookmarkSerializer,FeedbackSerializer,RatingSerializer,UserSerializer
from .chatbotservices import ChatbotQueryProcessor
from django.db.models import Q
import json

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request):
        data = request.data

        if (
            not data.get("username")
            or not data.get("password")
            or not data.get("email")
        ):
            return Response(
                {"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=data["email"]).exists():
            return Response(
                {"error": "Email is already in use"}, status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(username=data["username"]).exists():
            return Response(
                {"error": "Username is already taken"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.create(
                username=data["username"],
                email=data["email"],
                password=make_password(data["password"]),
            )

            Token.objects.get_or_create(user=user)

            return Response(
                {"message": "User created successfully"}, status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Missing email or password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {"error": "User with this email does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        authenticated_user = authenticate(
            request, username=user.username, password=password
        )
        if authenticated_user:
            token,created = Token.objects.get_or_create(user=authenticated_user)
            user_name = user.username
            user_email = user.email
            user_id = user.id
            return Response(
                {
                    "message": "Login successful",
                    "token": token.key,
                    "name": user_name,
                    "email": user_email,
                    "id": user_id,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

class ChangePasswordView(APIView):
    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response(
                {"error": "Both old and new passwords are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if old_password == new_password:
            return Response(
                {"error": "New password cannot be the same as the old password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        if not check_password(old_password, user.password):
            return Response(
                {"error": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.password = make_password(new_password)
        user.save()

        return Response(
            {"message": "Password updated successfully."}, status=status.HTTP_200_OK
        )

class ChatbotAPIView(APIView):
    def post(self, request):
        user_query = request.data.get("query", "").strip().lower()

        if not user_query:
            return Response(
                {"error": "Query is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        processor = ChatbotQueryProcessor(user_query, request.user)
        response_data = processor.process_query()

        return Response(response_data, status=status.HTTP_200_OK)

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        recipe_id = self.request.data.get("recipe")

        if Rating.objects.filter(user=user, recipe_id=recipe_id).exists():
            raise ValidationError("You have already rated this recipe.")

        rating = serializer.save(user=user)

        recipe = rating.recipe
        average_rating = self.get_average_rating(recipe)

        recipe.average_rating = average_rating
        recipe.save()

    def create(self, request, *args, **kwargs):
        super().create(request, *args, **kwargs)

        recipe_id = request.data.get("recipe")
        recipe = Recipe.objects.get(id=recipe_id)
        average_rating = self.get_average_rating(recipe)

        return Response(
            {
                "message": "Rating added successfully.",
                "average_rating": average_rating,
            },
            status=status.HTTP_201_CREATED,
        )

    def get_average_rating(self, recipe):
        ratings = recipe.rating_set.all()
        if ratings:
            return sum([rating.rating for rating in ratings]) / len(ratings)
        return 0

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BookmarkedRecipesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        bookmarked_recipes = Recipe.objects.filter(bookmarks__user=request.user)
        serializer = RecipeSerializer(bookmarked_recipes, many=True)
        return Response(serializer.data)

class BookmarkViewSet(viewsets.ModelViewSet):
    queryset = Bookmark.objects.all()
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request):
        recipe_id = request.data.get("recipe")
        recipe = Recipe.objects.filter(id=recipe_id).first()
        if not recipe:
            return Response(
                {"error": "Recipe does not exist."}, status=status.HTTP_400_BAD_REQUEST
            )
        if Bookmark.objects.filter(user=request.user, recipe=recipe).exists():
            return Response({"message": "Recipe already bookmarked."})
        Bookmark.objects.create(user=request.user, recipe=recipe)
        return Response(
            {"message": "Recipe bookmarked successfully!"},
            status=status.HTTP_201_CREATED,
        )

class RecipeSearchViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        search_query = request.query_params.get("search", None)
        if search_query:
            
            recipes = Recipe.objects.filter(
                Q(title__icontains=search_query)
                | Q(description__icontains=search_query)
            )
        else:
            recipes = Recipe.objects.none()

        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    search_fields = ["title", "description"]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        recipe = serializer.save(user=user)
        ingredients_data = self.request.data.get(
            "ingredients", "[]"
        ) 
        try:
            ingredients_data = json.loads(ingredients_data)

            if not isinstance(ingredients_data, list):
                raise ValidationError("Ingredients must be a list of dictionaries.")

            for ingredient_data in ingredients_data:
                if not isinstance(ingredient_data, dict):
                    raise ValidationError("Each ingredient must be a dictionary.")

                Ingredient.objects.create(recipe=recipe, **ingredient_data)

        except json.JSONDecodeError:
            raise ValidationError({"ingredients": "Invalid JSON format."})

        except ValidationError as e:
            raise ValidationError({"ingredients": str(e)})

        except Exception as e:
            raise ValidationError(
                {
                    "ingredients": "An unexpected error occurred while adding ingredients."
                }
            )

        return recipe

from rest_framework import serializers
from .models import Recipe, Ingredient, Comment, Bookmark, Feedback, Rating,ChatbotQuery
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username','email', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ChatbotQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatbotQuery
        fields = ['user', 'query', 'response']

class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Feedback
        fields = [
            'id',
            'user',
            'overall_rating',
            'ease_of_navigation',
            'visual_appeal',
            'recipe_search_experience',
            'recipe_content_quality',
            'ratings_comments_usefulness',
            'chatbot_helpfulness',
            'chatbot_response_speed',
            'favorite_feature',
            'least_favorite_feature',
            'suggestions_for_improvement',
            'additional_comments',
            'would_recommend',
            'likelihood_to_use_again',
        ]
    def create(self, validated_data):
        return super().create(validated_data)

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'quantity']

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'recipe', 'content', 'username']

class RatingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Rating
        fields = ['id', 'user', 'recipe', 'rating']

class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'recipe']

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, required=False)
    comments = CommentSerializer(many=True, required=False)
    ratings = RatingSerializer(many=True, required=False)
    average_rating = serializers.SerializerMethodField()
    parser_classes = (MultiPartParser, FormParser)

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'image', 'ingredients', 'comments', 'ratings', 'average_rating']

    def get_average_rating(self, obj):
        ratings = obj.rating_set.all()
        if ratings:
            return sum([rating.rating for rating in ratings]) / len(ratings)
        return 0

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        recipe = Recipe.objects.create(**validated_data)

        for ingredient_data in ingredients_data:
            Ingredient.objects.create(recipe=recipe, **ingredient_data)
    
        return recipe

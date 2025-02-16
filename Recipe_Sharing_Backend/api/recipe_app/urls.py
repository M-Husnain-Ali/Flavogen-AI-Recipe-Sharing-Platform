from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecipeViewSet, CommentViewSet, BookmarkViewSet, FeedbackViewSet, RatingViewSet, UserViewSet, LoginViewSet, ChangePasswordView,BookmarkedRecipesView,RecipeSearchViewSet,ChatbotAPIView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'recipes', RecipeViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'bookmarks', BookmarkViewSet)
router.register(r'feedback', FeedbackViewSet)
router.register(r'ratings', RatingViewSet)
router.register(r'login', LoginViewSet, basename='login')
router.register(r'recipe-search', RecipeSearchViewSet, basename='recipe-search')

urlpatterns = [
    path('', include(router.urls)),

    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('recipes/<int:pk>/', RecipeViewSet.as_view({'get': 'retrieve'}), name='recipe_detail'),
    path('bookmarked-recipes/', BookmarkedRecipesView.as_view(), name='bookmarked-recipes'),
    path('chatbot/', ChatbotAPIView.as_view(), name='chatbot'),
]

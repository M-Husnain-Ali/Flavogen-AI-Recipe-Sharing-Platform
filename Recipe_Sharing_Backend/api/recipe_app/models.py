from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='recipe_images/')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    

    def __str__(self):
        return self.title

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])

    class Meta:
        unique_together = ['user', 'recipe']

    def __str__(self):
        return f"Rating {self.rating} for {self.recipe.title} by {self.user.username}"

class Ingredient(models.Model):
    recipe = models.ForeignKey(Recipe, related_name='ingredients', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    quantity = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} - {self.quantity}"

class Comment(models.Model):
    recipe = models.ForeignKey(Recipe, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()

    def __str__(self):
        return f"Comment by {self.user.username} on {self.recipe.title}"

class Bookmark(models.Model):
    recipe = models.ForeignKey(Recipe, related_name='bookmarks', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Bookmark by {self.user.username} for {self.recipe.title}"

class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    overall_rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)
    ease_of_navigation = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)
    visual_appeal = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)
    recipe_search_experience = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)
    recipe_content_quality = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)
    ratings_comments_usefulness = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)
    chatbot_helpfulness = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)
    chatbot_response_speed = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)
    favorite_feature = models.TextField(blank=True, null=True)
    least_favorite_feature = models.TextField(blank=True, null=True)
    suggestions_for_improvement = models.TextField(blank=True, null=True)
    additional_comments = models.TextField(blank=True, null=True)
    would_recommend = models.BooleanField(blank=True, null=True, default=True)
    likelihood_to_use_again = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=3)

    def __str__(self):
        return f"Feedback from {self.user.username}"

class ChatbotQuery(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    query = models.TextField()
    response = models.TextField()

    def __str__(self):
        return f"Chatbot Query by {self.user.username if self.user else 'Guest'}"

from django.contrib import admin
from .models import Recipe, Ingredient, Rating, Comment, Bookmark, Feedback,ChatbotQuery


class IngredientInline(admin.TabularInline):
    model = Ingredient
    extra = 1  
    fields = ['name', 'quantity'] 

class RecipeAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'user']
    search_fields = ['title', 'description'] 
    inlines = [IngredientInline]

admin.site.register(Recipe, RecipeAdmin)
admin.site.register(Ingredient)
admin.site.register(Rating)
admin.site.register(Comment)
admin.site.register(Bookmark)
admin.site.register(Feedback)
admin.site.register(ChatbotQuery)

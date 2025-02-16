
from nltk.corpus import stopwords
from .models import Recipe, ChatbotQuery
from django.db.models import Q
from .serializers import RecipeSerializer

class QueryHandler:
    def __init__(self, user_query, user):
        self.user_query = user_query.strip().lower()
        self.user = user

    def handle(self):
        raise NotImplementedError("Subclasses should implement this method.")

class RecipeQueryHandler(QueryHandler):
    def __init__(self, user_query, user, stop_words):
        super().__init__(user_query, user)
        self.stop_words = stop_words

    def handle(self):
        keywords = [word for word in self.user_query.split() if word not in self.stop_words]
        query_filter = Q()
        for keyword in keywords:
            query_filter |= Q(title__icontains=keyword) | Q(description__icontains=keyword)

        recipes = Recipe.objects.filter(query_filter).distinct()
        if recipes.exists():
            return {"message": "Please find the requested recipe below", "recipes": RecipeSerializer(recipes, many=True).data}
        else:
            return {"message": "We're sorry, but no recipe was found. Try asking for something else!"}

class FlavogenQueryHandler(QueryHandler):
    def handle(self):
        return {"message": "FlavoGen is an intelligent platform designed to help users discover, share, and create recipes with ease. With advanced AI integration, FlavoGen offers seamless features to add, view, share, and bookmark recipes, making cooking a delightful and stress-free experience. Our platform also includes a chatbot assistant to guide and inspire your culinary journey."}

class GratitudeQueryHandler(QueryHandler):
    def handle(self):
        return {"message": "It’s always a pleasure to assist you! Feel free to reach out anytime you need help—I’m here for you. Wishing you a great day ahead!"}

class DefaultQueryHandler(QueryHandler):
    def handle(self):
        return {"message": "Hello! I am FlavoGen, your AI-powered Recipe Sharing Platform. I can assist you with recipe queries and more!"}

class StopWordsProcessor:
    def __init__(self):
        self.stop_words = set(stopwords.words("english"))

    def remove_stopwords(self, query):
        return [word for word in query.split() if word not in self.stop_words]

class ResponseSaver:
    def __init__(self, user, user_query):
        self.user = user
        self.user_query = user_query

    def save_response(self, response):
        chatbot_query = ChatbotQuery(user=self.user, query=self.user_query, response=response)
        chatbot_query.save()

class ChatbotQueryProcessor:
    def __init__(self, user_query, user):
        self.user_query = user_query
        self.user = user
        self.stop_words_processor = StopWordsProcessor()
        self.response_saver = ResponseSaver(self.user, self.user_query)

    def get_query_handler(self):

        if "recipe" in self.user_query or "ingredients" in self.user_query or "how to make" in self.user_query:
            return RecipeQueryHandler(self.user_query, self.user, self.stop_words_processor.stop_words)
        elif "flavogen" in self.user_query or "Flavogen" in self.user_query:
            return FlavogenQueryHandler(self.user_query, self.user)
        elif "thanks" in self.user_query or "great" in self.user_query:
            return GratitudeQueryHandler(self.user_query, self.user)
        else:
            return DefaultQueryHandler(self.user_query, self.user)

    def process_query(self):
        query_handler = self.get_query_handler()
        response = query_handler.handle()
        self.response_saver.save_response(response['message'])
        return response
import requests
import json
 
def fetch_data_from_themealdb():
    url = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
    response = requests.get(url)
    meals = response.json()['meals']
 
    meal_data = []
    for meal in meals:
        meal_data.append({
            "order_item_name": meal['strMeal'],
            "description": meal.get('strInstructions', ''),
            "photo_url": meal.get('strMealThumb', ''),
            "main_categories": meal.get('strCategory', ''),
            "ingredients": ";".join([meal[f'strIngredient{i}'] for i in range(1, 21) if meal[f'strIngredient{i}']]),
            "cuisine_types": meal.get('strArea', '')
        })
    return meal_data
 
orderItems = fetch_data_from_themealdb()
mainCategories=set()
cuisineTypes=set()
categories=[]
cuisines=[]

for i in orderItems:
    for j in (i["main_categories"].split(";")):
        mainCategories.add(j)
for i in mainCategories:
    categories.append({"main_category_name":i})
print(categories)

for i in orderItems:
    for j in (i["cuisine_types"].split(";")):
        cuisineTypes.add(j)
for i in cuisineTypes:
    cuisines.append({"cuisine_type":i})
print(cuisines)
 

with open('data/OrderItem.json', 'w') as f:
    json.dump(orderItems, f, indent=4)

with open('data/Categories.json', 'w') as f:
    json.dump(categories, f, indent=4)

with open('data/CuisineType.json', 'w') as f:
    json.dump(cuisines, f, indent=4)

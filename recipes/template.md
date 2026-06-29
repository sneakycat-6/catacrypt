---
name: Recipe Name Here
servings: 2
prep_time: 15 min
cook_time: 30 min
kcal: 450
protein: 28
carbs: 38
fat: 16
---

## Ingredients

- 200g main ingredient
- 3 eggs
- 2 tbsp olive oil
- 100ml broth
- 1 clove garlic
- 1 tsp paprika
- salt to taste
- black pepper to taste

## Preparation

1. Describe your first step here. Be as detailed as needed.
2. Second step of preparation.
3. Third step.
4. Continue adding as many steps as you like.
5. Final step — plate and serve.

## Notes

Optional section. Add any tips, substitutions, or storage advice here.
You can write multiple lines freely.

---
# CATACRYPT RECIPE FORMAT GUIDE
#
# FRONTMATTER (between the --- lines at the top):
#
#   name        — Recipe name displayed in the app  (required)
#   servings    — How many servings the ingredient quantities are written for (default: 2)
#   prep_time   — Preparation time, e.g. "15 min"
#   cook_time   — Cooking time, e.g. "30 min"
#   kcal        — Kilocalories per single serving (number only)
#   protein     — Protein in grams per serving (number only)
#   carbs       — Carbohydrates in grams per serving (number only)
#   fat         — Fat in grams per serving (number only)
#
#   All macro fields (kcal, protein, carbs, fat) are optional.
#   The app will scale them automatically when you change portions.
#
# INGREDIENTS:
#   Start each line with "- " followed by the quantity and ingredient.
#   The app scales lines that begin with a number.
#
#   Supported formats:
#     - 200g pasta           (number + metric unit glued, e.g. g kg ml l dl cl)
#     - 3 eggs               (number only)
#     - 2 tbsp olive oil     (number + unit + name)
#     - 1/2 tsp salt         (fraction)
#     - 1.5 cups flour       (decimal)
#     - salt to taste        (no number → kept as-is, not scaled)
#
#   Supported units: g, kg, ml, l, dl, cl,
#                    tsp, tbsp, cup/cups, oz, lb/lbs,
#                    piece/pieces, slice/slices, can/cans,
#                    handful, pinch, bunch, clove/cloves,
#                    sprig/sprigs, pcs, drop/drops
#
# SECTIONS:
#   Use "## Heading" to start a section. The app recognises:
#     ## Ingredients     — ingredient list (scaled by portions)
#     ## Preparation     — numbered steps (also: Steps, Method)
#     ## Notes           — free-form notes block
#   Any other ## section will be displayed as a notes block.
#
# PORTIONS:
#   The portion selector (1 / 2 / 4 / 8) scales all ingredient
#   quantities relative to the "servings" value in the frontmatter.
#   Example: recipe has servings: 2 and "200g pasta".
#   Selecting 4 portions → 400g pasta.
#   Selecting 1 portion  → 100g pasta.
#
# Delete these comment lines (starting with #) before uploading.

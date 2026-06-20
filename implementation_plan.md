# Implementation Plan - Expand Product Catalog (At least 6 items per category and more)

Expand the products catalog database by adding 12 new high-quality, premium gift items (3 new items for each of the 4 categories: Home Decor, Accessories, Kitchenware, Romantic & Hampers). This ensures that each category has exactly 9 items, meeting and exceeding the user's requirement of having "at least 6 items and more" per category.

## User Review Required

> [!NOTE]
> The database expansion will populate the catalog with a total of 36 high-quality products distributed evenly (9 items per category).
> The dropdown options in the Admin Dashboard will be updated to display only the 4 active categories.

## Proposed Changes

### Database Configs

#### [MODIFY] [db.json](file:///c:/Users/NUTHAKKI.CHAITRANSAI/Downloads/Gift%20corner/db.json)
- Add 12 new product objects (IDs 25 to 36) across the 4 categories:
  - **Home Decor**: Handcrafted Ceramic Essential Oil Diffuser (ID 25), Minimalist Brass Table Planter (ID 26), Hand-woven Bohemian Wall Tapestry (ID 27)
  - **Accessories**: Personalized Engraved Wooden Watch (ID 28), Classic Silver Monogram Cufflinks Set (ID 29), Premium Leather Key Organizer (ID 30)
  - **Kitchenware**: Custom Name Bamboo Tea Box Organizer (ID 31), Personalized Copper Moscow Mule Mugs Set (ID 32), Personalized Engraved Wooden Rolling Pin (ID 33)
  - **Romantic & Hampers**: Anniversary Love Message in a Bottle (ID 34), Luxury Coffee & Gourmet Cookies Gift Basket (ID 35), Deluxe Rose Soap Petals & Bath Bomb Set (ID 36)

#### [MODIFY] [data.json](file:///c:/Users/NUTHAKKI.CHAITRANSAI/Downloads/Gift%20corner/data/data.json)
- Keep in sync with `db.json` by adding the same 12 new products.

### Frontend Pages

#### [MODIFY] [AdminDashboard.jsx](file:///c:/Users/NUTHAKKI.CHAITRANSAI/Downloads/Gift%20corner/src/pages/AdminDashboard.jsx)
- Clean up the category selector `<select>` input to only offer the 4 active categories:
  - `Home Decor`
  - `Accessories`
  - `Kitchenware`
  - `Romantic & Hampers`

#### [MODIFY] [Home.jsx](file:///c:/Users/NUTHAKKI.CHAITRANSAI/Downloads/Gift%20corner/src/pages/Home.jsx)
- Update the category filter query parameter link on line 45 from `Romantic` to `Romantic & Hampers` to match the exact database category name: `/products?category=Romantic & Hampers`.

## Verification Plan

### Manual Verification
1. Inspect the Gifts Catalog page and count the items under each category filter:
   - "Home Decor": 9 items
   - "Accessories": 9 items
   - "Kitchenware": 9 items
   - "Romantic & Hampers": 9 items
2. Confirm that clicking the "Shop Romantic Gifts" link on the Home Page correctly navigates and filters the Products catalog to show only "Romantic & Hampers" items.
3. Verify that the Admin Dashboard's Category dropdown offers exactly the 4 active categories.
4. Run frontend build checks to ensure no linting/compilation issues exist.

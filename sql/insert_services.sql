-- Insert 30 different services into the services table
-- This script adds a variety of services across different categories

INSERT INTO public.services (name, description, image_url, price, category, provider_id)
VALUES
  -- Transport Services
  ('Car Rental', 'Rent a reliable car for your daily transportation needs or long trips.', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000', 45.00, 'Transport', NULL),
  ('Bike Rental', 'Eco-friendly bike rental for city exploration and exercise.', 'https://images.unsplash.com/photo-1544191696-15693072ce6b', 12.00, 'Transport', NULL),
  ('Motorcycle Rental', 'Fast and efficient motorcycle rental for urban commuting.', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13', 25.00, 'Transport', NULL),
  ('Taxi Service', 'Professional taxi service for convenient door-to-door transportation.', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000', 2.50, 'Transport', NULL),
  
  -- Home Services
  ('House Cleaning', 'Professional deep cleaning service for residential properties.', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952', 35.00, 'Home Services', NULL),
  ('Laundry Service', 'Convenient pickup and delivery laundry service.', 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60', 18.00, 'Home Services', NULL),
  ('Gardening Service', 'Complete garden maintenance including mowing, pruning, and landscaping.', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b', 40.00, 'Home Services', NULL),
  ('Furniture Assembly', 'Expert furniture assembly service for all types of furniture.', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7', 28.00, 'Home Services', NULL),
  
  -- Home Improvement
  ('Plumbing Repair', 'Licensed plumber for all your plumbing needs and emergencies.', 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189', 65.00, 'Home Improvement', NULL),
  ('Electrical Work', 'Certified electrician for safe electrical installations and repairs.', 'https://images.unsplash.com/photo-1621905251918-48416bd8575a', 70.00, 'Home Improvement', NULL),
  ('House Painting', 'Professional interior and exterior painting services.', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828', 120.00, 'Home Improvement', NULL),
  ('Carpet Installation', 'Expert carpet installation and flooring services.', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221', 85.00, 'Home Improvement', NULL),
  
  -- Technology Services
  ('Computer Repair', 'Fast and reliable computer repair and maintenance services.', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed', 50.00, 'Technology', NULL),
  ('Phone Repair', 'Screen replacement and phone repair services for all brands.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', 35.00, 'Technology', NULL),
  ('Network Setup', 'Professional home and office network installation and configuration.', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8', 95.00, 'Technology', NULL),
  
  -- Health & Fitness
  ('Personal Training', 'One-on-one fitness training sessions with certified trainers.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', 55.00, 'Health & Fitness', NULL),
  ('Massage Therapy', 'Relaxing therapeutic massage sessions for stress relief.', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874', 75.00, 'Health & Fitness', NULL),
  ('Yoga Classes', 'Group and private yoga instruction for all skill levels.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773', 30.00, 'Health & Fitness', NULL),
  ('Nutrition Consulting', 'Personalized nutrition plans and dietary advice from experts.', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061', 60.00, 'Health & Fitness', NULL),
  
  -- Education
  ('Math Tutoring', 'Expert math tutoring for students of all ages and levels.', 'https://images.unsplash.com/photo-1509228468518-180dd4864904', 40.00, 'Education', NULL),
  ('Language Lessons', 'Learn new languages with native speakers and certified instructors.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173', 45.00, 'Education', NULL),
  ('Music Lessons', 'Piano, guitar, and other instrument lessons for beginners to advanced.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f', 50.00, 'Education', NULL),
  
  -- Beauty & Personal Care
  ('Hair Styling', 'Professional haircuts, coloring, and styling services.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035', 35.00, 'Beauty', NULL),
  ('Makeup Services', 'Professional makeup application for events and special occasions.', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2', 80.00, 'Beauty', NULL),
  ('Manicure & Pedicure', 'Complete nail care services including manicure and pedicure.', 'https://images.unsplash.com/photo-1604654894610-df63bc536371', 25.00, 'Beauty', NULL),
  
  -- Pet Services
  ('Dog Walking', 'Reliable dog walking service for busy pet owners.', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1', 15.00, 'Pet Services', NULL),
  ('Pet Grooming', 'Complete pet grooming including bathing, trimming, and nail clipping.', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee', 45.00, 'Pet Services', NULL),
  ('Pet Sitting', 'Trusted pet sitting service in the comfort of your home.', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b', 20.00, 'Pet Services', NULL),
  
  -- Entertainment
  ('Photography', 'Professional photography for events, portraits, and special occasions.', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd', 100.00, 'Entertainment', NULL),
  ('Event DJ', 'Professional DJ services for parties, weddings, and corporate events.', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f', 150.00, 'Entertainment', NULL);

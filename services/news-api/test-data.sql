-- Test data for News API development
-- Run this to populate the database with sample data

-- Insert sample categories
INSERT INTO categories (name, article_count) VALUES
    ('정치', 150),
    ('경제', 200),
    ('사회', 180),
    ('국제', 120),
    ('스포츠', 90),
    ('연예', 110),
    ('IT/과학', 140),
    ('생활/문화', 95)
ON CONFLICT (name) DO UPDATE SET article_count = EXCLUDED.article_count;

-- Insert sample crawl statistics
INSERT INTO crawl_stats (date, total_crawled, success_count, failed_count) VALUES
    (CURRENT_DATE - INTERVAL '7 days', 500, 485, 15),
    (CURRENT_DATE - INTERVAL '6 days', 520, 510, 10),
    (CURRENT_DATE - INTERVAL '5 days', 480, 470, 10),
    (CURRENT_DATE - INTERVAL '4 days', 510, 500, 10),
    (CURRENT_DATE - INTERVAL '3 days', 495, 490, 5),
    (CURRENT_DATE - INTERVAL '2 days', 505, 495, 10),
    (CURRENT_DATE - INTERVAL '1 days', 515, 510, 5),
    (CURRENT_DATE, 250, 248, 2);

-- Display results
SELECT 'Categories' as table_name, COUNT(*) as row_count FROM categories
UNION ALL
SELECT 'Crawl Stats', COUNT(*) FROM crawl_stats;

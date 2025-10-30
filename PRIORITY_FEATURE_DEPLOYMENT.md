# הוראות להפעלת פיצ'ר העדיפות (Priority Feature)

## שלב 1: עדכון הקוד בשרת

הקוד כבר נדחף ל-GitHub ו-Actions יעדכן אוטומטית.
אם צריך עדכון ידני:

```bash
cd /var/www/trachtenberg-events/current
git pull origin main
```

## שלב 2: הרצת Migration למסד הנתונים

חובה להריץ את ה-migration כדי להוסיף את עמודת priority:

```bash
cd /var/www/trachtenberg-events/current
node backend/src/migrations/add-priority-to-gallery.js
```

או ישירות ב-PostgreSQL:

```bash
sudo -u postgres psql -d trachtenberg_events -c "
ALTER TABLE gallery_items
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0
CHECK (priority >= 0 AND priority <= 3);

UPDATE gallery_items
SET priority = 0
WHERE priority IS NULL;
"
```

## שלב 3: אתחול מחדש של השרת

```bash
pm2 restart trachtenberg-backend
```

## שלב 4: בדיקה

1. כנס לממשק הניהול: http://72.61.144.195/admin
2. ערוך תמונה קיימת
3. בחר עדיפות (0-3 כוכבים)
4. שמור
5. בדוק שהתמונה מופיעה בסדר הנכון בגלריה הציבורית

## רמות העדיפות

- **0 כוכבים** = רגיל (ברירת מחדל)
- **1 כוכב** = נמוך
- **2 כוכבים** = בינוני
- **3 כוכבים** = גבוה (מוצג ראשון)

תמונות מוצגות לפי: priority DESC → created_at DESC

# 📤 העלאה ידנית לGitHub - הוראות מפורטות

## 🎯 המטרה: העלאת הפרויקט ל-https://github.com/Riky-Shlomowitz/ET_events

---

## 🔐 שלב 1: הכנת אימות GitHub

### אפשרות A: Personal Access Token (מומלץ)
1. **לך לGitHub** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)**
3. **הגדרות**:
   - Name: `Trachtenberg Events Deployment`
   - Expiration: `90 days`
   - Scopes: ✅ `repo` (full control)
4. **Generate token** ושמור אותו!

### אפשרות B: GitHub CLI (פשוט יותר)
```bash
# התקן GitHub CLI
winget install --id GitHub.cli

# התחבר
gh auth login
# בחר: GitHub.com → HTTPS → Yes → Login with browser
```

---

## 📁 שלב 2: הכנת הפרויקט

### במחשב המקומי - בתיקיית הפרויקט:

#### בדוק שהכל מוכן:
```bash
# בדוק שGit מוכן
git status

# אם יש קבצים לא tracked
git add .
git commit -m "🎉 Initial commit - Trachtenberg Events"
```

#### בדוק את הremote:
```bash
git remote -v
# אמור להראות:
# origin  https://github.com/Riky-Shlomowitz/ET_events.git (fetch)
# origin  https://github.com/Riky-Shlomowitz/ET_events.git (push)
```

---

## 🚀 שלב 3: העלאה לGitHub

### עם Personal Access Token:
```bash
# החלף YOUR_TOKEN בtoken שקיבלת
git remote set-url origin https://YOUR_TOKEN@github.com/Riky-Shlomowitz/ET_events.git

# עלה לGitHub
git push -u origin main
```

### עם GitHub CLI:
```bash
# פשוט עלה
gh repo sync
```

### אם עדיין לא עובד - העלאה ידנית:
1. **לך לrepository בGitHub**: https://github.com/Riky-Shlomowitz/ET_events
2. **לחץ "uploading an existing file"**
3. **גרור את כל התיקיות והקבצים**
4. **Commit message**: `🎉 Initial upload - Trachtenberg Events`
5. **Commit directly to main branch**

---

## 📋 שלב 4: בדיקה שהכל הועלה

### בGitHub Repository בדוק שיש:
```
📁 .github/workflows/
   └── deploy-hostinger.yml
📁 backend/
   ├── src/
   ├── package.json
   └── SETUP.md
📁 public/images/
   ├── logo.png
   └── gallery/ (8 תמונות)
📁 src/
   ├── components/
   ├── lib/
   ├── pages/
   └── utils/
📄 README.md
📄 DEPLOYMENT_GUIDE.md
📄 HOSTINGER_DEPLOYMENT_GUIDE.md
📄 package.json
📄 .gitignore
```

---

## ⚙️ שלב 5: הגדרת GitHub Actions

### בGitHub Repository:
1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** לכל אחד מהבאים:

```
Name: SERVER_HOST
Value: [IP של השרת שלך מהוסטינגר]

Name: SERVER_USER
Value: root

Name: SERVER_PASSWORD  
Value: [סיסמת השרת מהוסטינגר]

Name: DB_PASSWORD
Value: strongDBpass123

Name: JWT_SECRET
Value: trachtenberg-events-jwt-secret-production-2025-very-long-secure-key
```

---

## 🧪 שלב 6: בדיקה שהכל עובד

### בדוק GitHub Actions:
1. **Actions tab** בrepository
2. **אמור להיות workflow** בשם "🚀 Deploy to Hostinger VPS"
3. **אם אין** - בדוק שקובץ `.github/workflows/deploy-hostinger.yml` קיים

### הפעל deployment ראשון:
```bash
# עשה שינוי קטן
echo "# Test deployment" >> TEST.md
git add TEST.md
git commit -m "🧪 Test deployment"
git push origin main
```

### בדוק בActions:
- **Actions tab** → **תראה את הפריסה רצה**
- **אם ירוק** ✅ = הצליח
- **אם אדום** ❌ = בדוק לוגים

---

## 🎯 אם משהו לא עובד

### בעיית אימות GitHub:
```bash
# נסה עם SSH במקום HTTPS
git remote set-url origin git@github.com:Riky-Shlomowitz/ET_events.git

# או עם GitHub CLI
gh repo clone Riky-Shlomowitz/ET_events temp
cp -r * temp/
cd temp
git add .
git commit -m "Upload via CLI"
git push
```

### בעיית GitHub Actions:
1. **בדוק Secrets** - כל השמות נכונים
2. **בדוק Workflow file** - בנתיב הנכון
3. **בדוק Logs** - בActions tab

### בעיית חיבור לשרת:
```bash
# בדוק חיבור SSH ידני
ssh root@YOUR_SERVER_IP
# אם לא עובד - בדוק IP וסיסמה בהוסטינגר
```

---

## ✅ רשימת בדיקה

לאחר העלאה מוצלחת:
- [ ] **Repository קיים** בGitHub
- [ ] **כל הקבצים הועלו** (בדוק ברשימה למעלה)
- [ ] **GitHub Secrets הוגדרו** (5 secrets)
- [ ] **Actions מופעל** (ירוק בActions tab)
- [ ] **שרת מגיב** (curl http://server-ip)

---

## 🎉 סיכום

**אחרי השלבים האלה:**
- ✅ **הפרויקט בGitHub** עם כל הקבצים
- ✅ **GitHub Actions מוכן** לפריסה אוטומטית
- ✅ **Secrets מוגדרים** לחיבור מאובטח
- ✅ **מוכן לפריסה** בלחיצת כפתור

**הצעד הבא: פריסה לשרת!** 🚀

---

*אם יש בעיות - תמיד אפשר לעלות ידנית דרך GitHub Web Interface*

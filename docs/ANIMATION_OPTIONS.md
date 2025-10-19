# אפשרויות אנימציה לתמונת רקע

## כעת הוספתי 4 סוגי אנימציות שונות לתמונת הרקע:

### 1. **animate-hero-zoom** (מותקן כעת)
תנועה של זום + תזוזה אופקית
- משך: 20 שניות
- אפקט: התמונה מתקרבת ל-110% ונעה ימינה
- מומלץ ל: אפקט דרמטי ומושך תשומת לב

### 2. **animate-ken-burns**
אפקט Ken Burns קלאסי (זום איטי עם תנועה אלכסונית)
- משך: 30 שניות
- אפקט: התמונה מתקרבת ל-115% ונעה אלכסונית
- מומלץ ל: אפקט קולנועי מקצועי

### 3. **animate-subtle-pan**
תנועה עדינה מצד לצד
- משך: 15 שניות
- אפקט: התמונה נעה ימינה ושמאלה ללא זום
- מומלץ ל: אפקט עדין ומינימליסטי

### 4. **animate-zoom-in-out**
זום פשוט פנימה והחוצה
- משך: 12 שניות
- אפקט: התמונה מתקרבת ל-108% וחוזרת
- מומלץ ל: אפקט עדין וקליל

## איך להחליף בין האנימציות?

בקובץ `src/pages/EventPlanning.jsx`, שורה 267:

```jsx
// אופציה 1: זום + תזוזה (נוכחי)
<div className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-hero-zoom"

// אופציה 2: Ken Burns קלאסי
<div className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-ken-burns"

// אופציה 3: תנועה עדינה מצד לצד
<div className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-subtle-pan"

// אופציה 4: זום פשוט
<div className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-zoom-in-out"

// אופציה 5: ללא אנימציה
<div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
```

## איך להאט או להאיץ את האנימציה?

בקובץ `src/index.css`, תוכל לשנות את משך האנימציה:

```css
/* דוגמה: להאט את הזום */
.animate-hero-zoom {
  animation: hero-zoom 30s ease-in-out infinite; /* שנה מ-20s ל-30s */
}
```

## טיפים:
- אנימציות איטיות יותר (25-40 שניות) נראות יותר מקצועיות
- אנימציות מהירות יותר (10-15 שניות) נראות יותר דינמיות
- אפשר לשלב אנימציות עם `transition-all duration-300` לאפקטים נוספים


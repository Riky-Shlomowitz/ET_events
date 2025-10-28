import { useState } from 'react';
import { User } from '@/lib/localData';
import { Button } from '@/components/ui/forms/button';
import { Input } from '@/components/ui/forms/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card';
import { Alert, AlertDescription } from '@/components/ui/feedback/alert';
import { Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use the User.login function from local data system
      await User.login(email, password);
      // אימות מוצלח - נווט לדף הניהול
      navigate(createPageUrl('AdminDashboard'));
    } catch (err) {
      console.error('Login error:', err);
      setError('שם משתמש או סיסמה שגויים');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/images/logo.png" 
            alt="עמנואל טרכטנברג הפקת אירועים" 
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white mb-2">כניסת מנהל</h1>
          <p className="text-gray-400">מערכת ניהול תוכן</p>
        </div>

        <Card className="bg-gray-800/50 border-gold/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gold" />
            </div>
            <CardTitle className="text-gold text-xl">התחברות מאובטחת</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-500/50 text-red-200">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <UserIcon className="w-4 h-4 inline ml-2" />
                  כתובת מייל
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="הזינו את כתובת המייל"
                  required
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-gold focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Lock className="w-4 h-4 inline ml-2" />
                  סיסמה
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="הזינו את הסיסמה"
                    required
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-gold focus:border-gold pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-3 text-lg disabled:opacity-50"
              >
                {isLoading ? 'מתחבר...' : 'התחבר למערכת'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              <p>גישה מוגבלת למנהלי המערכת בלבד</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .text-gold { color: #D4AF37; }
        .bg-gold { background-color: #D4AF37; }
        .border-gold { border-color: #D4AF37; }
        .hover\\:bg-gold\\/90:hover { background-color: rgba(212, 175, 55, 0.9); }
        .bg-gold\\/10 { background-color: rgba(212, 175, 55, 0.1); }
        .border-gold\\/20 { border-color: rgba(212, 175, 55, 0.2); }
        .ring-gold { --tw-ring-color: #D4AF37; }
      `}</style>
    </div>
  );
}
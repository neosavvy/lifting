import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'

export const Auth = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#00ff00',
                brandAccent: '#008000',
                inputBackground: '#000000',
                inputText: '#00ff00',
                inputBorder: '#00ff00',
                inputBorderHover: '#008000',
                inputBorderFocus: '#00ff00',
                inputPlaceholder: '#006400',
              },
              fonts: {
                bodyFontFamily: `"Share Tech Mono", monospace`,
                buttonFontFamily: `"Share Tech Mono", monospace`,
                inputFontFamily: `"Share Tech Mono", monospace`,
                labelFontFamily: `"Share Tech Mono", monospace`,
              },
              radii: {
                borderRadiusButton: '4px',
                buttonBorderRadius: '4px',
                inputBorderRadius: '4px',
              },
            },
          },
          className: {
            container: 'auth-container',
            button: 'auth-button',
            input: 'auth-input',
            label: 'auth-label',
          },
        }}
        providers={[]}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </div>
  )
} 
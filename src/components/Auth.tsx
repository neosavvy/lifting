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
                messageText: '#00ff00',
                anchorTextColor: '#00ff00',
                anchorTextHoverColor: '#008000',
                dividerBackground: '#00ff00',
                labelTextColor: '#00ff00',
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
            button: 'auth-button text-black dark:text-[#00ff00]',
            input: 'auth-input text-[#00ff00]',
            label: 'auth-label text-[#00ff00]',
            anchor: 'text-[#00ff00] hover:text-[#008000]',
            message: 'text-[#00ff00]',
          },
        }}
        providers={[]}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </div>
  )
} 
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'

export const Auth = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 text-[#00ff00]">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#00ff00',
                brandAccent: '#008000',
                brandButtonText: 'white',
                defaultButtonBackground: '#2e2e2e',
                defaultButtonBackgroundHover: '#3e3e3e',
                defaultButtonBorder: '#00ff00',
                defaultButtonText: '#00ff00',
                dividerBackground: '#00ff00',
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
            container: 'auth-container text-[#00ff00]',
            button: 'auth-button bg-[#00ff00] text-black hover:bg-[#008000]',
            input: 'auth-input text-[#00ff00] bg-black border-[#00ff00] border rounded placeholder-[#00ff00]',
            label: 'auth-label text-[#00ff00] !important',
            anchor: 'text-[#00ff00] hover:text-[#008000]',
            message: 'text-[#00ff00] !important',
          },
        }}
        providers={[]}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </div>
  )
} 
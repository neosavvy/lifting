import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'

export const Auth = () => {
  return (
    <div className="w-full max-w-full mx-auto text-[#00ff00] overflow-hidden">
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
            container: 'auth-container text-[#00ff00] max-w-full overflow-hidden',
            button: 'auth-button bg-[#00ff00] text-black hover:bg-[#008000] w-full',
            input: 'auth-input text-[#00ff00] bg-black border-[#00ff00] border rounded placeholder-[#00ff00] w-full text-base',
            label: 'auth-label text-[#00ff00] !important text-sm sm:text-base',
            anchor: 'text-[#00ff00] hover:text-[#008000] text-sm sm:text-base',
            message: 'text-[#00ff00] !important text-sm sm:text-base break-words',
          },
        }}
        providers={[]}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </div>
  )
} 
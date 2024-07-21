const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else if (user) {
      const { data: sessionData, error: sessionError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .single()
  
      if (sessionError && sessionError.code !== 'PGRST116') {
        setError(sessionError.message)
        return
      }
  
      const currentTime = new Date()
      const lastLogin = sessionData ? new Date(sessionData.last_login) : new Date(0)
      const timeDiff = (currentTime.getTime() - lastLogin.getTime()) / (1000 * 3600) // in hours
  
      if (!sessionData || timeDiff > 24 || sessionData.last_ip !== (await getIpAddress())) {
        // Require email authentication
        const { error: authError } = await supabase.auth.signOut()
        if (authError) {
          setError(authError.message)
        } else {
          router.push('/auth/email-auth')
        }
      } else {
        // Update session
        const { error: updateError } = await supabase
          .from('user_sessions')
          .upsert({ user_id: user.id, last_login: currentTime.toISOString(), last_ip: await getIpAddress() })
  
        if (updateError) {
          setError(updateError.message)
        } else {
          router.push('/dashboard')
        }
      }
    }
  }
  
  async function getIpAddress() {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    return data.ip
  }
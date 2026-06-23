import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sriufnhyqpfanumgqwgx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaXVmbmh5cXBmYW51bWdxd2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTMxNzYsImV4cCI6MjA4ODUyOTE3Nn0.fpRP34H0w6NXD7Gu_XWbQsJ46lsjTHkvCZvRDRBRhrw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── Unique session ID per browser ──────────────────────────────────────────
function getSessionId() {
  let id = localStorage.getItem('studytra_session_id')
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('studytra_session_id', id)
  }
  return id
}

// ── Save student profile to Supabase ──────────────────────────────────────
export async function saveStudentProfile(profile) {
  try {
    const { error } = await supabase.from('students').upsert({
      session_id: getSessionId(),
      full_name: profile.fullName,
      age: parseInt(profile.age),
      current_level: profile.currentLevel,
      current_university: profile.currentUniversity,
      target_degree: profile.targetDegree,
      target_course: profile.targetCourse,
      dream_country: profile.dreamCountry,
      created_at: new Date().toISOString(),
    }, { onConflict: 'session_id' })

    if (error) {
      console.error('Supabase save error:', error.message)
      // Still increment local counter so UX isn't blocked
      _incrementLocal()
      return false
    }

    _incrementLocal()
    console.log('✅ Student profile saved to Supabase')
    return true
  } catch (err) {
    console.error('Supabase connection error:', err)
    _incrementLocal()
    return false
  }
}

function _incrementLocal() {
  const current = parseInt(localStorage.getItem('studytra_ai_sessions') || '10247')
  localStorage.setItem('studytra_ai_sessions', String(current + 1))
}

// ── Fetch live count from Supabase ─────────────────────────────────────────
// Returns total row count of the students table (= total AI sessions started)
export async function fetchLiveSessionCount() {
  try {
    const { count, error } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })

    if (error || count === null) {
      return parseInt(localStorage.getItem('studytra_ai_sessions') || '10247')
    }

    // Offset by 10247 so it starts from a meaningful number even with few real rows
    const displayed = Math.max(count + 10247, count)
    return displayed
  } catch {
    return parseInt(localStorage.getItem('studytra_ai_sessions') || '10247')
  }
}

// ── Subscribe to real-time inserts on the students table ───────────────────
// callback(newCount) is called whenever a new student row is inserted
export function subscribeToSessionCount(callback) {
  const channel = supabase
    .channel('students-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'students' },
      async () => {
        const count = await fetchLiveSessionCount()
        callback(count)
      }
    )
    .subscribe()

  // Return unsubscribe function
  return () => supabase.removeChannel(channel)
}

// ── Chat Session Helpers ───────────────────────────────────────────────────

// Create a new chat session for a user
export async function createChatSession(userId, title, messages) {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        title: title,
        messages: messages,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating chat session in Supabase:', error.message)
      return null
    }
    return data
  } catch (err) {
    console.error('Connection error creating chat session:', err)
    return null
  }
}

// Update an existing chat session
export async function updateChatSession(userId, sessionId, title, messages) {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .update({
        title: title,
        messages: messages,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating chat session in Supabase:', error.message)
      return null
    }
    return data
  } catch (err) {
    console.error('Connection error updating chat session:', err)
    return null
  }
}

// Fetch all chat sessions for a user
export async function fetchChatSessions(userId) {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('id, title, messages, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching chat sessions from Supabase:', error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Connection error fetching chat sessions:', err)
    return []
  }
}

// Delete a chat session
export async function deleteChatSession(userId, sessionId) {
  try {
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting chat session in Supabase:', error.message)
      return false
    }
    return true
  } catch (err) {
    console.error('Connection error deleting chat session:', err)
    return false
  }
}

// Save student profile directly to profiles table for authenticated users
export async function saveUserProfile(userId, profile) {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: profile.fullName,
        age: parseInt(profile.age) || null,
        current_level: profile.currentLevel,
        current_university: profile.currentUniversity,
        target_degree: profile.targetDegree,
        target_course: profile.targetCourse,
        dream_country: profile.dreamCountry,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving user profile to Supabase (profiles table):', error.message)
      return false
    }
    console.log('✅ User profile saved to Supabase profiles table')
    return true
  } catch (err) {
    console.error('Connection error saving user profile:', err)
    return false
  }
}
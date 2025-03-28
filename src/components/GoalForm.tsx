const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!user) return

  try {
    console.log('User ID:', user.id) // Debug log
    const { error } = await supabase
      .from('goals')
      .insert([
        {
          user_id: user.id,
          name: formData.name,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          status: formData.status,
          due_date: formData.due_date,
          frequency: formData.frequency,
          logic_type: formData.logic_type,
          target_value: formData.target_value,
          unit: formData.unit
        }
      ])
      .select()

    if (error) {
      console.error('Error inserting goal:', error) // Debug log
      throw error
    }

    onSuccess()
  } catch (error) {
    console.error('Error:', error)
    setError('Failed to create goal')
  }
} 
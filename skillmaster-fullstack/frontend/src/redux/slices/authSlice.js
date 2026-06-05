// redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const user = JSON.parse(localStorage.getItem('skillmaster_user'))

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('skillmaster_user', JSON.stringify(data))
    return data
  } catch (err) {
    if (!err.response) {
      return thunkAPI.rejectWithValue('Network Error: Server might be down or restarting.')
    }
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const { data } = await api.post('/auth/register', userData)
    return data
  } catch (err) {
    if (!err.response) {
      return thunkAPI.rejectWithValue('Network Error: Server might be down or restarting.')
    }
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, thunkAPI) => {
  try {
    const { data } = await api.put('/auth/update', formData)
    const current = JSON.parse(localStorage.getItem('skillmaster_user'))
    const updated = { ...current, ...data }
    localStorage.setItem('skillmaster_user', JSON.stringify(updated))
    return updated
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update failed')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: user ? user : null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('skillmaster_user')
      state.user = null
      state.error = null
    },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

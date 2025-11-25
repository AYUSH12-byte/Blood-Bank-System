import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data and role based on email
      let role = 'donor'
      if (formData.email.includes('admin')) {
        role = 'admin'
      } else if (formData.email.includes('staff')) {
        role = 'staff'
      }
      
      const userData = {
        id: 1,
        name: formData.email.split('@')[0],
        email: formData.email
      }
      
      onLogin(userData, role)
      navigate('/dashboard')
    } catch (error) {
      setErrors({ general: 'Invalid email or password' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen  from-red-50 to-red-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Blood Slogan Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-red-600 opacity-40">
          <div className="animate-pulse">
            <h2 className="text-4xl font-bold mb-2">Give Blood</h2>
            <p className="text-xl">Save Lives</p>
          </div>
        </div>
        
        <div className="absolute top-40 right-20 text-red-600 opacity-35">
          <div className="animate-bounce">
            <h3 className="text-3xl font-bold mb-2">Be a Hero</h3>
            <p className="text-lg">Donate Today</p>
          </div>
        </div>
        
        <div className="absolute bottom-20 left-20 text-red-600 opacity-40">
          <div className="animate-pulse">
            <h3 className="text-3xl font-bold mb-2">Every Drop</h3>
            <p className="text-lg">Counts</p>
          </div>
        </div>
        
        <div className="absolute bottom-40 right-10 text-red-600 opacity-35">
          <div className="animate-bounce">
            <h3 className="text-2xl font-bold mb-2">Life is in</h3>
            <p className="text-lg">Your Hands</p>
          </div>
        </div>
        
        {/* Animated Blood Drops */}
        <div className="absolute top-20 left-1/2 text-red-500 opacity-20 animate-ping">
          <span className="text-6xl">🩸</span>
        </div>
        <div className="absolute top-60 right-1/3 text-red-500 opacity-20 animate-ping" style={{animationDelay: '1s'}}>
          <span className="text-5xl">🩸</span>
        </div>
        <div className="absolute bottom-32 left-1/3 text-red-500 opacity-20 animate-ping" style={{animationDelay: '2s'}}>
          <span className="text-4xl">🩸</span>
        </div>
        
        {/* Floating Blood Cells Animation */}
        <div className="absolute top-1/4 left-1/4 text-red-600 opacity-10 animate-spin" style={{animationDuration: '20s'}}>
          <span className="text-8xl">🩸</span>
        </div>
        <div className="absolute bottom-1/4 right-1/4 text-red-600 opacity-10 animate-spin" style={{animationDuration: '25s', animationDirection: 'reverse'}}>
          <span className="text-6xl">🩸</span>
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🩸</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Blood Bank System</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-red-600 hover:text-red-500">
             
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-red-600 hover:text-red-500 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

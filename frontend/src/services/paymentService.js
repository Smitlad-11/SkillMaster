// services/paymentService.js
import api from './api'
import toast from 'react-hot-toast'

export const purchaseCourse = async (courseId) => {
  // Step 1: Create order on backend
  const { data } = await api.post('/orders/create', { courseId })

  if (data.free || data.bypassed) {
    toast.success(data.bypassed ? 'Enrolled in course! (Demo mode)' : 'Enrolled in free course!')
    return { success: true }
  }

  // Step 2: Open Razorpay checkout
  return new Promise((resolve, reject) => {
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      order_id: data.orderId,
      name: 'SkillMaster',
      description: `Course: ${data.courseName}`,
      handler: async (response) => {
        try {
          // Step 3: Verify payment on backend
          await api.post('/payments/verify', response)
          toast.success('Payment successful! Course enrolled.')
          resolve({ success: true })
        } catch (err) {
          toast.error('Payment verification failed')
          reject(err)
        }
      },
      prefill: {},
      theme: { color: '#2563EB' },
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) }
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      toast.error('Payment failed: ' + response.error.description)
      reject(response.error)
    })
    rzp.open()
  })
}

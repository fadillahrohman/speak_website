import React from 'react'
import LoadingButton from '../components/LoadingButton'

function Testing() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="p-8 bg-white rounded shadow-md text-center max-w-md">
      <div className="text-green-500 text-5xl mb-4">✓</div>
      <h1 className="text-2xl font-bold text-green-600 mb-2">Email Berhasil Diverifikasi!</h1>
      <p className="mb-4">
        Terima kasih! Email <span className="font-semibold">fadillahrohman@gmail.com</span> telah berhasil diverifikasi.
      </p>
      <p className="mb-6">Anda sekarang dapat menggunakan akun Anda untuk login.</p>
      <LoadingButton/>
      <p className="text-sm text-gray-500 mt-4">Anda akan dialihkan ke halaman login dalam 5 detik...</p>
    </div>
  </div>
  )
}

export default Testing
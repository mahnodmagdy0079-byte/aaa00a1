"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, Check } from "lucide-react"

interface PasswordChangeRequestProps {
  request: any
  onPasswordUpdate: (requestId: string, newPassword: string) => void
  language: string
}

export default function PasswordChangeRequest({ request, onPasswordUpdate, language }: PasswordChangeRequestProps) {
  const [newPassword, setNewPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const content = {
    ar: {
      title: "طلب تغيير كلمة المرور",
      tool: "الأداة",
      ultraId: "Ultra ID",
      oldPassword: "كلمة المرور القديمة",
      reason: "السبب",
      newPasswordLabel: "كلمة المرور الجديدة",
      newPasswordPlaceholder: "أدخل كلمة المرور الجديدة",
      updateButton: "تحديث كلمة المرور",
      updating: "جاري التحديث...",
    },
    en: {
      title: "Password Change Request",
      tool: "Tool",
      ultraId: "Ultra ID",
      oldPassword: "Old Password",
      reason: "Reason",
      newPasswordLabel: "New Password",
      newPasswordPlaceholder: "Enter new password",
      updateButton: "Update Password",
      updating: "Updating...",
    },
  }

  const currentContent = content[language as keyof typeof content] || content.ar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword.trim()) return

    setIsSubmitting(true)
    await onPasswordUpdate(request.id, newPassword.trim())
    setIsSubmitting(false)
    setNewPassword("")
  }

  return (
    <div className="bg-gray-800 border border-orange-500/20 rounded-lg p-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-orange-500/10 p-2 rounded-lg">
          <AlertCircle className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium mb-2">{currentContent.title}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">{currentContent.tool}:</span>
              <span className="text-white ml-2">{request.tool_name}</span>
            </div>
            <div>
              <span className="text-gray-400">{currentContent.ultraId}:</span>
              <span className="text-white ml-2">{request.ultra_id}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-400">{currentContent.oldPassword}:</span>
              <span className="text-white ml-2 font-mono bg-gray-700 px-2 py-1 rounded">{request.old_password}</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-400">{currentContent.reason}:</span>
              <span className="text-orange-400 ml-2">{request.reason}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{currentContent.newPasswordLabel}</label>
          <input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={currentContent.newPasswordPlaceholder}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !newPassword.trim()}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {currentContent.updating}
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              {currentContent.updateButton}
            </>
          )}
        </button>
      </form>
    </div>
  )
}

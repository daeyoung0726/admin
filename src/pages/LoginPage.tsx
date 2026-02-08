import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signInAdmin } from "@/apis/auth"
import type { AdminSession } from "@/types/session"
import { ApiError } from "@/apis/client"
import CenteredCardLayout from "@/components/CenteredCardLayout"

const MIN_NICKNAME_LENGTH = 2

type LoginPageProps = {
  onSuccess: (session: AdminSession) => void
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const [nickname, setNickname] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    if (nickname.trim().length < MIN_NICKNAME_LENGTH) {
      setErrorMessage("닉네임은 2자 이상이어야 합니다.")
      return
    }

    try {
      setLoading(true)
      const data = await signInAdmin({ nickname: nickname.trim() })
      onSuccess({ id: data.id, nickname: nickname.trim() })
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.errors?.nickname ?? error.message)
      } else if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("로그인에 실패했습니다.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <CenteredCardLayout title="Roulette-Up Admin">
      <div className="mx-auto w-full max-w-[520px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-base font-semibold text-slate-800">
              닉네임
            </label>

            <Input
              id="nickname"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="어드민 닉네임을 입력하세요"
              className="h-14 rounded-xl border-slate-200 bg-white px-4 text-[16px] shadow-sm focus-visible:ring-2 focus-visible:ring-[#1F5BFF]/25"
            />
          </div>

          {errorMessage ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-xl bg-[#1F5BFF] text-[16px] font-semibold text-white shadow-sm hover:bg-[#1A4AE0] active:bg-[#173FC6]"
          >
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </div>
    </CenteredCardLayout>
  )
}
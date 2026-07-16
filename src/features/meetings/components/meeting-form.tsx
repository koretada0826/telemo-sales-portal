"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { meetingInputSchema, type MeetingFormValues } from "../schema";
import { createMeetingAction, updateMeetingAction } from "../actions";
import { MEETING_METHOD_LABEL, MEETING_STATUS_LABEL } from "@/types/meeting";

type Props = { meetingId?: string; defaultValues?: Partial<MeetingFormValues> };
const toLocal = (iso: string | null | undefined) => (iso ? iso.slice(0, 16) : "");

export function MeetingForm({ meetingId, defaultValues }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingInputSchema),
    defaultValues: {
      companyName: "", contactName: "", contactRole: "",
      meetingAt: new Date().toISOString(),
      method: "online", status: "scheduled",
      content: "", customerIssue: "", proposal: "", budget: "",
      hasDecisionMaker: false, nextAction: "", nextMeetingAt: null,
      minutes: "", relatedCallId: null, tagIds: [],
      ...defaultValues,
    },
  });

  const onSubmit = (v: MeetingFormValues) => {
    const norm: MeetingFormValues = {
      ...v,
      meetingAt: v.meetingAt ? new Date(v.meetingAt).toISOString() : new Date().toISOString(),
      nextMeetingAt: v.nextMeetingAt ? new Date(v.nextMeetingAt).toISOString() : null,
    };
    startTransition(async () => {
      const r = meetingId ? await updateMeetingAction(meetingId, norm) : await createMeetingAction(norm);
      if (r.ok) {
        toast.success(meetingId ? "商談ログを更新しました" : "商談ログを記録しました");
        router.push(r.id ? `/meetings/${r.id}` : "/meetings");
        router.refresh();
      } else toast.error(r.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-4 sm:p-6">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="companyName" required>企業名</Label>
              <Input id="companyName" error={Boolean(errors.companyName)} {...register("companyName")} />
              {errors.companyName && <p className="text-xs text-danger">{errors.companyName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactName">商談相手</Label>
              <Input id="contactName" {...register("contactName")} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contactRole">役職</Label>
              <Input id="contactRole" {...register("contactRole")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meetingAt" required>商談日時</Label>
              <Input id="meetingAt" type="datetime-local"
                defaultValue={toLocal(defaultValues?.meetingAt ?? new Date().toISOString())}
                {...register("meetingAt")} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="method" required>商談方法</Label>
              <Select id="method" {...register("method")}>
                {Object.entries(MEETING_METHOD_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status" required>ステータス</Label>
              <Select id="status" {...register("status")}>
                {Object.entries(MEETING_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="content">商談内容</Label>
            <Textarea id="content" rows={4} {...register("content")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customerIssue">顧客課題</Label>
            <Textarea id="customerIssue" rows={3} {...register("customerIssue")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="proposal">提案内容</Label>
            <Textarea id="proposal" rows={4} {...register("proposal")} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="budget">予算</Label>
              <Input id="budget" placeholder="例：月額30万円" {...register("budget")} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input id="hasDecisionMaker" type="checkbox"
                className="h-4 w-4 accent-mint" {...register("hasDecisionMaker")} />
              <Label htmlFor="hasDecisionMaker">決裁者が同席・関与している</Label>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nextAction">次回アクション</Label>
            <Textarea id="nextAction" rows={2} {...register("nextAction")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nextMeetingAt">次回予定日時</Label>
            <Input id="nextMeetingAt" type="datetime-local"
              defaultValue={toLocal(defaultValues?.nextMeetingAt)}
              {...register("nextMeetingAt")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="minutes">議事録</Label>
            <Textarea id="minutes" rows={6} {...register("minutes")} />
          </div>
        </div>
      </Card>
      <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isPending}>
          <X className="h-4 w-4" />キャンセル
        </Button>
        <Button type="submit" disabled={isPending}>
          <Save className="h-4 w-4" />
          {isPending ? "保存中..." : meetingId ? "更新する" : "記録する"}
        </Button>
      </div>
    </form>
  );
}

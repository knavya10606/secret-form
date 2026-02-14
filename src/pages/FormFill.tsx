import { useState } from "react";
import { useFormStore } from "@/store/formStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import type { FormResponse } from "@/types/form";

const FormFill = () => {
  const { form, addResponse } = useFormStore();
  const [answers, setAnswers] = useState<FormResponse>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const setValue = (qId: string, value: string | string[]) => {
    setAnswers((a) => ({ ...a, [qId]: value }));
    setErrors((e) => ({ ...e, [qId]: false }));
  };

  const toggleCheckbox = (qId: string, optionId: string) => {
    const current = (answers[qId] as string[]) || [];
    const next = current.includes(optionId)
      ? current.filter((v) => v !== optionId)
      : [...current, optionId];
    setValue(qId, next);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    form.questions.forEach((q) => {
      if (q.required) {
        const val = answers[q.id];
        if (!val || (Array.isArray(val) && val.length === 0) || val === "") {
          newErrors[q.id] = true;
        }
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    addResponse(answers);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="pt-10 pb-10 space-y-4">
            <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Your response has been recorded</h2>
            <p className="text-muted-foreground">Thank you for your anonymous feedback.</p>
            <Button variant="outline" onClick={() => { setSubmitted(false); setAnswers({}); }}>
              Submit another response
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Form header */}
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-2xl">{form.title}</CardTitle>
            <CardDescription className="text-base">{form.description}</CardDescription>
          </CardHeader>
        </Card>

        {/* Questions */}
        {form.questions.map((q, i) => (
          <Card key={q.id} className={errors[q.id] ? "border-destructive" : ""}>
            <CardContent className="pt-6 space-y-3">
              <div>
                <Label className="text-base font-medium">
                  {q.title}
                  {q.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {q.description && (
                  <p className="text-sm text-muted-foreground mt-1">{q.description}</p>
                )}
              </div>

              {q.type === "short_text" && (
                <Input
                  placeholder="Your answer"
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => setValue(q.id, e.target.value)}
                />
              )}

              {q.type === "long_text" && (
                <Textarea
                  placeholder="Your answer"
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => setValue(q.id, e.target.value)}
                />
              )}

              {q.type === "multiple_choice" && q.options && (
                <RadioGroup
                  value={(answers[q.id] as string) || ""}
                  onValueChange={(v) => setValue(q.id, v)}
                >
                  {q.options.map((opt) => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={opt.id} id={`${q.id}-${opt.id}`} />
                      <Label htmlFor={`${q.id}-${opt.id}`} className="font-normal cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {q.type === "checkbox" && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${q.id}-${opt.id}`}
                        checked={((answers[q.id] as string[]) || []).includes(opt.id)}
                        onCheckedChange={() => toggleCheckbox(q.id, opt.id)}
                      />
                      <Label htmlFor={`${q.id}-${opt.id}`} className="font-normal cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {errors[q.id] && (
                <p className="text-sm text-destructive">This question is required</p>
              )}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-between items-center">
          <Button onClick={handleSubmit} size="lg">Submit</Button>
          <Button variant="ghost" onClick={() => setAnswers({})}>Clear form</Button>
        </div>
      </div>
    </div>
  );
};

export default FormFill;

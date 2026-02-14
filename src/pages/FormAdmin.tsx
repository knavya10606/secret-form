import { useState } from "react";
import { useFormStore } from "@/store/formStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChevronUp, ChevronDown, FileText, BarChart3 } from "lucide-react";
import type { QuestionType } from "@/types/form";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const typeLabels: Record<QuestionType, string> = {
  short_text: "Short Text",
  long_text: "Long Text",
  multiple_choice: "Multiple Choice",
  checkbox: "Checkboxes",
};

let optId = 200;

const FormAdmin = () => {
  const { form, responses, updateQuestion, addQuestion, removeQuestion, moveQuestion, setForm } = useFormStore();
  const [tab, setTab] = useState("questions");

  return (
    <div className="min-h-screen bg-muted/40 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <Input
              className="text-2xl font-semibold border-none px-0 focus-visible:ring-0 h-auto"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              className="border-none px-0 focus-visible:ring-0 resize-none text-muted-foreground"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </CardHeader>
        </Card>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="questions" className="flex-1 gap-2">
              <FileText className="h-4 w-4" /> Questions
            </TabsTrigger>
            <TabsTrigger value="responses" className="flex-1 gap-2">
              <BarChart3 className="h-4 w-4" /> Responses ({responses.length})
            </TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions" className="space-y-4">
            {form.questions.map((q, i) => (
              <Card key={q.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="flex-1 space-y-3">
                      <Input
                        placeholder="Question title"
                        value={q.title}
                        onChange={(e) => updateQuestion(q.id, { title: e.target.value })}
                      />
                      <Input
                        placeholder="Description (optional)"
                        value={q.description || ""}
                        onChange={(e) => updateQuestion(q.id, { description: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                    <Select
                      value={q.type}
                      onValueChange={(v) => {
                        const type = v as QuestionType;
                        const needsOptions = type === "multiple_choice" || type === "checkbox";
                        updateQuestion(q.id, {
                          type,
                          options: needsOptions && !q.options?.length
                            ? [{ id: `o${optId++}`, label: "Option 1" }]
                            : q.options,
                        });
                      }}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(typeLabels).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Options editor for choice types */}
                  {(q.type === "multiple_choice" || q.type === "checkbox") && (
                    <div className="space-y-2 pl-4">
                      {q.options?.map((opt, oi) => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded-${q.type === "multiple_choice" ? "full" : "sm"} border border-muted-foreground`} />
                          <Input
                            value={opt.label}
                            onChange={(e) => {
                              const newOpts = [...(q.options || [])];
                              newOpts[oi] = { ...opt, label: e.target.value };
                              updateQuestion(q.id, { options: newOpts });
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              updateQuestion(q.id, { options: q.options?.filter((o) => o.id !== opt.id) });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateQuestion(q.id, {
                            options: [...(q.options || []), { id: `o${optId++}`, label: `Option ${(q.options?.length || 0) + 1}` }],
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add option
                      </Button>
                    </div>
                  )}

                  {/* Bottom controls */}
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={q.required}
                        onCheckedChange={(v) => updateQuestion(q.id, { required: v })}
                      />
                      <Label className="text-sm">Required</Label>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => moveQuestion(q.id, "up")} disabled={i === 0}>
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => moveQuestion(q.id, "down")} disabled={i === form.questions.length - 1}>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add question */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(typeLabels) as QuestionType[]).map((type) => (
                    <Button key={type} variant="outline" onClick={() => addQuestion(type)}>
                      <Plus className="h-4 w-4 mr-1" /> {typeLabels[type]}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Responses Tab */}
          <TabsContent value="responses" className="space-y-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-foreground">{responses.length}</p>
                <p className="text-muted-foreground">Total anonymous responses</p>
              </CardContent>
            </Card>

            {responses.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground py-12">
                  No responses yet. Share the form link to start collecting anonymous feedback.
                </CardContent>
              </Card>
            ) : (
              form.questions.map((q) => (
                <Card key={q.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{q.title}</CardTitle>
                    <CardDescription>{responses.length} responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(q.type === "short_text" || q.type === "long_text") && (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {responses.map((r, ri) => {
                          const val = r[q.id] as string;
                          return val ? (
                            <div key={ri} className="p-3 rounded-md bg-muted text-sm">
                              {val}
                            </div>
                          ) : null;
                        })}
                      </div>
                    )}

                    {(q.type === "multiple_choice" || q.type === "checkbox") && q.options && (
                      <ChartContainer config={{}} className="h-[200px] w-full">
                        <BarChart
                          data={q.options.map((opt) => ({
                            name: opt.label,
                            count: responses.filter((r) => {
                              const val = r[q.id];
                              return Array.isArray(val) ? val.includes(opt.id) : val === opt.id;
                            }).length,
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FormAdmin;

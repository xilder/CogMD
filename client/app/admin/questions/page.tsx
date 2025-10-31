"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const mockQuestions = [
  {
    id: 1,
    text: "A 45-year-old man presents with chest pain...",
    specialty: "Cardiology",
    difficulty: "Hard",
    answered: 1203,
  },
  {
    id: 2,
    text: "What is the first-line treatment for hypertension?",
    specialty: "Internal Medicine",
    difficulty: "Medium",
    answered: 2145,
  },
  {
    id: 3,
    text: "Describe the pathophysiology of diabetes mellitus...",
    specialty: "Endocrinology",
    difficulty: "Hard",
    answered: 892,
  },
]

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedQuestion, setSelectedQuestion] = useState<(typeof mockQuestions)[0] | null>(null)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Question Bank Management</h1>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search by question text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select>
            <option value="">All Specialties</option>
            <option value="cardiology">Cardiology</option>
            <option value="internal">Internal Medicine</option>
            <option value="endocrinology">Endocrinology</option>
          </Select>
          <Select>
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Select>
        </div>
      </Card>

      {/* Questions Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question Text</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Times Answered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockQuestions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="max-w-xs truncate">{question.text}</TableCell>
                <TableCell>{question.specialty}</TableCell>
                <TableCell>{question.difficulty}</TableCell>
                <TableCell>{question.answered}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedQuestion(question)}>
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Question</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Question Text</label>
                          <Textarea defaultValue={selectedQuestion?.text} className="mt-2" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Explanation</label>
                          <Textarea placeholder="Enter explanation..." className="mt-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Difficulty</label>
                            <Select defaultValue={selectedQuestion?.difficulty}>
                              <option value="easy">Easy</option>
                              <option value="medium">Medium</option>
                              <option value="hard">Hard</option>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Specialty</label>
                            <Select defaultValue={selectedQuestion?.specialty}>
                              <option value="cardiology">Cardiology</option>
                              <option value="internal">Internal Medicine</option>
                            </Select>
                          </div>
                        </div>
                        <Button className="w-full">Save Changes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

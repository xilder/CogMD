import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"

const requests = [
  {
    name: "Ese Jerry",
    course: "Research Technologies and Innovation",
    requestDate: "05/09/2025",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    name: "Grace Bura",
    course: "Research Technologies and Innovation",
    requestDate: "02/09/2025",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-800",
  },
  {
    name: "Amaka Okechukwu",
    course: "Research Technologies and Innovation",
    requestDate: "15/09/2025",
    status: "Rejected",
    statusColor: "bg-red-100 text-red-800",
  },
  {
    name: "Ese Jerry",
    course: "Research Technologies and Innovation",
    requestDate: "05/09/2025",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800",
  },
]

export function CertificateRequests() {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">Certificate Requests</CardTitle>
        <Button variant="link" className="text-purple-600 p-0 self-start sm:self-auto">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 hidden sm:table-cell">
                  Course
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                  Date
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index} className="border-b border-gray-50">
                  <td className="py-3 px-2 sm:py-4 sm:px-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-xs font-medium">
                          {request.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 block truncate">
                          {request.name}
                        </span>
                        <span className="text-xs text-gray-500 block sm:hidden truncate">{request.course}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 sm:py-4 sm:px-4 hidden sm:table-cell">
                    <span className="text-sm text-gray-600">{request.course}</span>
                  </td>
                  <td className="py-3 px-2 sm:py-4 sm:px-4">
                    <span className="text-xs sm:text-sm text-gray-600">{request.requestDate}</span>
                  </td>
                  <td className="py-3 px-2 sm:py-4 sm:px-4">
                    <Badge variant="secondary" className={`${request.statusColor} text-xs`}>
                      {request.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 sm:py-4 sm:px-4">
                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                      <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

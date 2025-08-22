import { Avatar } from "./ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { MoreHorizontal } from "lucide-react"

const leaderboard = [
  {
    username: "陳志明",
    school: "台北市建國中學",
    score: 2847,
    rank: 1,
    mathLevel: "IMO",
    change: "+127",
    avatar: "/avatar/koala-avatar.png",
  },
  {
    username: "林雅婷",
    school: "台中女中",
    score: 2756,
    rank: 2,
    mathLevel: "學測",
    change: "+89",
    avatar: "/avatar/fox-avatar.png",
  },
  {
    username: "王大明",
    school: "高雄中學",
    score: 2698,
    rank: 3,
    mathLevel: "Calculus",
    change: "+156",
    avatar: "/avatar/bear-avatar.png",
  },
  {
    username: "張小華",
    school: "新竹實驗中學",
    score: 2634,
    rank: 4,
    mathLevel: "AMC",
    change: "+67",
    avatar: "/avatar/rabbit-avatar.png",
  },
  {
    username: "李美玲",
    school: "台南一中",
    score: 2589,
    rank: 5,
    mathLevel: "學測",
    change: "+234",
    avatar: "/avatar/owl-avatar.png",
  },
]

export function VaultTable() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">數學競賽排行榜</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>參賽者</TableHead>
            <TableHead>學校</TableHead>
            <TableHead>分數 ↓</TableHead>
            <TableHead>排名</TableHead>
            <TableHead>數學級別</TableHead>
            <TableHead>分數變化</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((participant) => (
            <TableRow key={participant.username}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                    <img 
                      src={participant.avatar} 
                      alt={`${participant.username} avatar`}
                      className="h-full w-full object-cover"
                    />
                  </Avatar>
                  <div className="font-medium">{participant.username}</div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{participant.school}</TableCell>
              <TableCell className="font-semibold">{participant.score.toLocaleString()}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center justify-center rounded-full w-8 h-8 text-sm font-bold ${
                    participant.rank === 1
                      ? "bg-yellow-500/20 text-yellow-500"
                      : participant.rank === 2
                        ? "bg-gray-400/20 text-gray-400"
                        : participant.rank === 3
                          ? "bg-orange-600/20 text-orange-600"
                          : "bg-muted text-muted-foreground"
                  }`}
                >
                  #{participant.rank}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    participant.mathLevel === "IMO"
                      ? "bg-red-500/10 text-red-500"
                      : participant.mathLevel === "Calculus"
                        ? "bg-blue-500/10 text-blue-500"
                        : participant.mathLevel === "AMC"
                          ? "bg-purple-500/10 text-purple-500"
                          : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {participant.mathLevel}
                </span>
              </TableCell>
              <TableCell className="text-green-500 font-medium">+{participant.change}</TableCell>
              <TableCell>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

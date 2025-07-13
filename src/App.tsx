import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Progress } from './components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Alert, AlertDescription } from './components/ui/alert'
import { 
  Globe, 
  Shield, 
  Coins, 
  Users, 
  Zap, 
  Target, 
  AlertTriangle,
  Clock,
  Trophy,
  Handshake,
  Sword,
  Factory,
  Crown,
  Flag
} from 'lucide-react'

interface Nation {
  id: string
  name: string
  flag: string
  continent: string
  economy: number
  military: number
  population: number
  stability: number
  isPlayer: boolean
  isAlly: boolean
  isEnemy: boolean
  color: string
}

interface GameEvent {
  id: string
  title: string
  description: string
  type: 'diplomatic' | 'military' | 'economic' | 'crisis'
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface Alliance {
  id: string
  name: string
  members: string[]
  strength: number
}

const INITIAL_NATIONS: Nation[] = [
  { id: 'usa', name: 'United States', flag: '🇺🇸', continent: 'North America', economy: 95, military: 100, population: 85, stability: 80, isPlayer: true, isAlly: false, isEnemy: false, color: '#3B82F6' },
  { id: 'china', name: 'China', flag: '🇨🇳', continent: 'Asia', economy: 90, military: 95, population: 100, stability: 75, isPlayer: false, isAlly: false, isEnemy: true, color: '#EF4444' },
  { id: 'russia', name: 'Russia', flag: '🇷🇺', continent: 'Europe/Asia', economy: 60, military: 90, population: 45, stability: 65, isPlayer: false, isAlly: false, isEnemy: true, color: '#DC2626' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', continent: 'Europe', economy: 75, military: 70, population: 25, stability: 85, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981' },
  { id: 'france', name: 'France', flag: '🇫🇷', continent: 'Europe', economy: 70, military: 65, population: 25, stability: 80, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', continent: 'Europe', economy: 80, military: 60, population: 30, stability: 90, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981' },
  { id: 'india', name: 'India', flag: '🇮🇳', continent: 'Asia', economy: 65, military: 75, population: 95, stability: 70, isPlayer: false, isAlly: false, isEnemy: false, color: '#6B7280' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', continent: 'Asia', economy: 85, military: 55, population: 40, stability: 95, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981' },
]

const INITIAL_ALLIANCES: Alliance[] = [
  { id: 'nato', name: 'NATO Alliance', members: ['usa', 'uk', 'france', 'germany'], strength: 85 },
  { id: 'eastern', name: 'Eastern Bloc', members: ['china', 'russia'], strength: 75 },
]

function App() {
  const [nations, setNations] = useState<Nation[]>(INITIAL_NATIONS)
  const [alliances, setAlliances] = useState<Alliance[]>(INITIAL_ALLIANCES)
  const [events, setEvents] = useState<GameEvent[]>([])
  const [selectedNation, setSelectedNation] = useState<Nation | null>(nations[0])
  const [gamePhase, setGamePhase] = useState<'preparation' | 'conflict' | 'resolution'>('preparation')
  const [turn, setTurn] = useState(1)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [globalTension, setGlobalTension] = useState(45)
  const [isGameStarted, setIsGameStarted] = useState(false)

  // Timer effect
  useEffect(() => {
    if (!isGameStarted) return
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          nextTurn()
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isGameStarted, turn])

  const nextTurn = () => {
    setTurn(prev => prev + 1)
    generateRandomEvent()
    updateNationStats()
    
    if (turn >= 10) {
      setGamePhase('resolution')
    } else if (turn >= 5) {
      setGamePhase('conflict')
    }
  }

  const generateRandomEvent = () => {
    const eventTypes = ['diplomatic', 'military', 'economic', 'crisis'] as const
    const severities = ['low', 'medium', 'high', 'critical'] as const
    
    const events = [
      { title: 'Trade Sanctions Imposed', description: 'Economic sanctions have been placed on key trade routes', type: 'economic' },
      { title: 'Military Buildup Detected', description: 'Satellite imagery shows increased military activity', type: 'military' },
      { title: 'Diplomatic Summit Called', description: 'Emergency diplomatic talks have been scheduled', type: 'diplomatic' },
      { title: 'Cyber Attack Reported', description: 'Critical infrastructure has been targeted', type: 'crisis' },
      { title: 'Alliance Tensions Rise', description: 'Disagreements emerge within major alliances', type: 'diplomatic' },
      { title: 'Resource Shortage Crisis', description: 'Critical resources are becoming scarce', type: 'crisis' },
    ]
    
    const randomEvent = events[Math.floor(Math.random() * events.length)]
    const newEvent: GameEvent = {
      id: `event-${Date.now()}`,
      title: randomEvent.title,
      description: randomEvent.description,
      type: randomEvent.type as any,
      timestamp: Date.now(),
      severity: severities[Math.floor(Math.random() * severities.length)]
    }
    
    setEvents(prev => [newEvent, ...prev.slice(0, 4)])
    
    // Adjust global tension based on event
    const tensionChange = newEvent.severity === 'critical' ? 15 : 
                         newEvent.severity === 'high' ? 10 : 
                         newEvent.severity === 'medium' ? 5 : 2
    setGlobalTension(prev => Math.min(100, prev + tensionChange))
  }

  const updateNationStats = () => {
    setNations(prev => prev.map(nation => ({
      ...nation,
      economy: Math.max(0, Math.min(100, nation.economy + (Math.random() - 0.5) * 10)),
      military: Math.max(0, Math.min(100, nation.military + (Math.random() - 0.5) * 5)),
      stability: Math.max(0, Math.min(100, nation.stability + (Math.random() - 0.5) * 8)),
    })))
  }

  const performDiplomaticAction = (action: string, targetNation: string) => {
    const newEvent: GameEvent = {
      id: `action-${Date.now()}`,
      title: `Diplomatic Action: ${action}`,
      description: `${selectedNation?.name} has initiated ${action} with ${targetNation}`,
      type: 'diplomatic',
      timestamp: Date.now(),
      severity: 'medium'
    }
    setEvents(prev => [newEvent, ...prev.slice(0, 4)])
    
    // Adjust tension based on action
    const tensionChange = action.includes('Sanction') || action.includes('Threat') ? 8 : -5
    setGlobalTension(prev => Math.max(0, Math.min(100, prev + tensionChange)))
  }

  const deployMilitary = (region: string) => {
    if (!selectedNation) return
    
    const newEvent: GameEvent = {
      id: `military-${Date.now()}`,
      title: 'Military Deployment',
      description: `${selectedNation.name} has deployed forces to ${region}`,
      type: 'military',
      timestamp: Date.now(),
      severity: 'high'
    }
    setEvents(prev => [newEvent, ...prev.slice(0, 4)])
    setGlobalTension(prev => Math.min(100, prev + 12))
  }

  const startGame = () => {
    setIsGameStarted(true)
    generateRandomEvent()
  }

  const getTensionColor = (tension: number) => {
    if (tension >= 80) return 'bg-red-500'
    if (tension >= 60) return 'bg-orange-500'
    if (tension >= 40) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getTensionLabel = (tension: number) => {
    if (tension >= 80) return 'CRITICAL'
    if (tension >= 60) return 'HIGH'
    if (tension >= 40) return 'MODERATE'
    return 'LOW'
  }

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold text-primary">World War 3 Simulator</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              A strategic simulation of global conflict and diplomacy
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Military Strategy</h3>
                <p className="text-sm text-muted-foreground">Deploy forces and manage conflicts</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Handshake className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold">Diplomacy</h3>
                <p className="text-sm text-muted-foreground">Form alliances and negotiate</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Coins className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Economy</h3>
                <p className="text-sm text-muted-foreground">Manage resources and trade</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Target className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-semibold">Victory</h3>
                <p className="text-sm text-muted-foreground">Achieve your objectives</p>
              </div>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is a strategic simulation game. Make decisions carefully as they will affect global stability and your nation's future.
              </AlertDescription>
            </Alert>
            
            <Button onClick={startGame} className="w-full" size="lg">
              <Crown className="h-5 w-5 mr-2" />
              Begin Simulation
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Globe className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">WW3 Simulator</h1>
                <p className="text-sm text-muted-foreground">Turn {turn} • {gamePhase.charAt(0).toUpperCase() + gamePhase.slice(1)} Phase</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-lg">{timeRemaining}s</span>
                </div>
                <p className="text-xs text-muted-foreground">Time Remaining</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className={`font-bold ${globalTension >= 80 ? 'text-red-500' : globalTension >= 60 ? 'text-orange-500' : 'text-green-500'}`}>
                    {getTensionLabel(globalTension)}
                  </span>
                </div>
                <Progress value={globalTension} className="w-24 h-2" />
                <p className="text-xs text-muted-foreground">Global Tension</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* World Map & Nations */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  World Nations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {nations.map(nation => (
                    <div
                      key={nation.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedNation?.id === nation.id ? 'ring-2 ring-primary' : ''
                      } ${nation.isPlayer ? 'bg-blue-500/10' : nation.isAlly ? 'bg-green-500/10' : nation.isEnemy ? 'bg-red-500/10' : 'bg-muted/50'}`}
                      onClick={() => setSelectedNation(nation)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{nation.flag}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{nation.name}</h3>
                          <p className="text-xs text-muted-foreground">{nation.continent}</p>
                        </div>
                        {nation.isPlayer && <Crown className="h-4 w-4 text-primary" />}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Economy</span>
                          <span>{nation.economy}%</span>
                        </div>
                        <Progress value={nation.economy} className="h-1" />
                        
                        <div className="flex justify-between text-xs">
                          <span>Military</span>
                          <span>{nation.military}%</span>
                        </div>
                        <Progress value={nation.military} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alliances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-5 w-5" />
                  Global Alliances
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alliances.map(alliance => (
                    <div key={alliance.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{alliance.name}</h3>
                        <Badge variant="outline">{alliance.strength}% Strength</Badge>
                      </div>
                      <div className="flex gap-1">
                        {alliance.members.map(memberId => {
                          const member = nations.find(n => n.id === memberId)
                          return member ? (
                            <span key={memberId} className="text-lg" title={member.name}>
                              {member.flag}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {selectedNation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    {selectedNation.name} Command Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="diplomacy">Diplomacy</TabsTrigger>
                      <TabsTrigger value="military">Military</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                          <Coins className="h-6 w-6 text-green-500 mx-auto mb-1" />
                          <div className="text-2xl font-bold">{selectedNation.economy}%</div>
                          <p className="text-xs text-muted-foreground">Economy</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <Shield className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                          <div className="text-2xl font-bold">{selectedNation.military}%</div>
                          <p className="text-xs text-muted-foreground">Military</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <Users className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                          <div className="text-2xl font-bold">{selectedNation.population}%</div>
                          <p className="text-xs text-muted-foreground">Population</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <Zap className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                          <div className="text-2xl font-bold">{selectedNation.stability}%</div>
                          <p className="text-xs text-muted-foreground">Stability</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="diplomacy" className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => performDiplomaticAction('Trade Agreement', 'Allied Nations')}
                        >
                          Trade Agreement
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => performDiplomaticAction('Peace Treaty', 'Neutral Nations')}
                        >
                          Peace Treaty
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => performDiplomaticAction('Economic Sanctions', 'Enemy Nations')}
                        >
                          Sanctions
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => performDiplomaticAction('Military Threat', 'Enemy Nations')}
                        >
                          Threaten
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="military" className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deployMilitary('Eastern Europe')}
                        >
                          <Sword className="h-4 w-4 mr-1" />
                          Eastern Europe
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deployMilitary('South China Sea')}
                        >
                          <Sword className="h-4 w-4 mr-1" />
                          South China Sea
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deployMilitary('Middle East')}
                        >
                          <Sword className="h-4 w-4 mr-1" />
                          Middle East
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deployMilitary('Arctic Region')}
                        >
                          <Sword className="h-4 w-4 mr-1" />
                          Arctic Region
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* News Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Global News Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {events.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No recent events</p>
                  ) : (
                    events.map(event => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-sm">{event.title}</h4>
                          <Badge 
                            variant={event.severity === 'critical' ? 'destructive' : 
                                   event.severity === 'high' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{event.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Victory Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Victory Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Global Stability</span>
                    <span className="text-sm font-mono">{100 - globalTension}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alliance Strength</span>
                    <span className="text-sm font-mono">85%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Economic Dominance</span>
                    <span className="text-sm font-mono">{selectedNation?.economy || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Turns Remaining</span>
                    <span className="text-sm font-mono">{Math.max(0, 10 - turn)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
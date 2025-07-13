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
  Flag,
  MapPin,
  Crosshair
} from 'lucide-react'

interface Territory {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  owner: string
  population: number
  resources: number
  defenseStrength: number
  isCapital: boolean
  continent: string
}

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
  territories: string[]
}

interface GameEvent {
  id: string
  title: string
  description: string
  type: 'diplomatic' | 'military' | 'economic' | 'crisis' | 'war'
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface Alliance {
  id: string
  name: string
  members: string[]
  strength: number
}

interface WarAction {
  attackerId: string
  defenderId: string
  territoryId: string
  attackerStrength: number
  defenderStrength: number
  result: 'victory' | 'defeat' | 'ongoing'
}

const INITIAL_TERRITORIES: Territory[] = [
  // North America
  { id: 'usa-east', name: 'Eastern USA', x: 15, y: 25, width: 12, height: 8, owner: 'usa', population: 180, resources: 85, defenseStrength: 90, isCapital: true, continent: 'North America' },
  { id: 'usa-west', name: 'Western USA', x: 5, y: 25, width: 10, height: 8, owner: 'usa', population: 120, resources: 70, defenseStrength: 80, isCapital: false, continent: 'North America' },
  { id: 'canada', name: 'Canada', x: 8, y: 15, width: 15, height: 10, owner: 'canada', population: 40, resources: 90, defenseStrength: 60, isCapital: true, continent: 'North America' },
  { id: 'mexico', name: 'Mexico', x: 10, y: 33, width: 8, height: 5, owner: 'mexico', population: 130, resources: 45, defenseStrength: 40, isCapital: true, continent: 'North America' },
  
  // Europe
  { id: 'uk', name: 'United Kingdom', x: 45, y: 20, width: 4, height: 6, owner: 'uk', population: 67, resources: 60, defenseStrength: 85, isCapital: true, continent: 'Europe' },
  { id: 'france', name: 'France', x: 47, y: 25, width: 5, height: 6, owner: 'france', population: 68, resources: 65, defenseStrength: 75, isCapital: true, continent: 'Europe' },
  { id: 'germany', name: 'Germany', x: 50, y: 22, width: 5, height: 6, owner: 'germany', population: 83, resources: 70, defenseStrength: 80, isCapital: true, continent: 'Europe' },
  { id: 'russia-west', name: 'Western Russia', x: 55, y: 18, width: 12, height: 10, owner: 'russia', population: 80, resources: 95, defenseStrength: 95, isCapital: true, continent: 'Europe' },
  { id: 'ukraine', name: 'Ukraine', x: 52, y: 25, width: 6, height: 4, owner: 'ukraine', population: 44, resources: 55, defenseStrength: 70, isCapital: true, continent: 'Europe' },
  
  // Asia
  { id: 'russia-east', name: 'Eastern Russia', x: 67, y: 15, width: 15, height: 12, owner: 'russia', population: 65, resources: 100, defenseStrength: 85, isCapital: false, continent: 'Asia' },
  { id: 'china-north', name: 'Northern China', x: 70, y: 25, width: 10, height: 8, owner: 'china', population: 400, resources: 80, defenseStrength: 100, isCapital: true, continent: 'Asia' },
  { id: 'china-south', name: 'Southern China', x: 72, y: 33, width: 8, height: 6, owner: 'china', population: 600, resources: 75, defenseStrength: 90, isCapital: false, continent: 'Asia' },
  { id: 'india', name: 'India', x: 65, y: 35, width: 8, height: 8, owner: 'india', population: 1400, resources: 60, defenseStrength: 85, isCapital: true, continent: 'Asia' },
  { id: 'japan', name: 'Japan', x: 82, y: 28, width: 4, height: 6, owner: 'japan', population: 125, resources: 55, defenseStrength: 75, isCapital: true, continent: 'Asia' },
  { id: 'korea', name: 'Korea', x: 80, y: 26, width: 3, height: 4, owner: 'korea', population: 77, resources: 50, defenseStrength: 70, isCapital: true, continent: 'Asia' },
  
  // Middle East
  { id: 'iran', name: 'Iran', x: 58, y: 32, width: 6, height: 5, owner: 'iran', population: 85, resources: 85, defenseStrength: 75, isCapital: true, continent: 'Middle East' },
  { id: 'saudi', name: 'Saudi Arabia', x: 55, y: 35, width: 6, height: 6, owner: 'saudi', population: 35, resources: 95, defenseStrength: 60, isCapital: true, continent: 'Middle East' },
  
  // Africa
  { id: 'egypt', name: 'Egypt', x: 52, y: 38, width: 4, height: 5, owner: 'egypt', population: 104, resources: 40, defenseStrength: 55, isCapital: true, continent: 'Africa' },
  { id: 'south-africa', name: 'South Africa', x: 50, y: 55, width: 6, height: 6, owner: 'south-africa', population: 60, resources: 70, defenseStrength: 50, isCapital: true, continent: 'Africa' },
  
  // South America
  { id: 'brazil', name: 'Brazil', x: 25, y: 45, width: 12, height: 12, owner: 'brazil', population: 215, resources: 80, defenseStrength: 65, isCapital: true, continent: 'South America' },
  { id: 'argentina', name: 'Argentina', x: 22, y: 55, width: 8, height: 8, owner: 'argentina', population: 45, resources: 65, defenseStrength: 45, isCapital: true, continent: 'South America' },
  
  // Oceania
  { id: 'australia', name: 'Australia', x: 75, y: 50, width: 10, height: 8, owner: 'australia', population: 26, resources: 85, defenseStrength: 60, isCapital: true, continent: 'Oceania' },
]

const INITIAL_NATIONS: Nation[] = [
  { id: 'usa', name: 'United States', flag: '🇺🇸', continent: 'North America', economy: 95, military: 100, population: 85, stability: 80, isPlayer: true, isAlly: false, isEnemy: false, color: '#3B82F6', territories: ['usa-east', 'usa-west'] },
  { id: 'china', name: 'China', flag: '🇨🇳', continent: 'Asia', economy: 90, military: 95, population: 100, stability: 75, isPlayer: false, isAlly: false, isEnemy: true, color: '#EF4444', territories: ['china-north', 'china-south'] },
  { id: 'russia', name: 'Russia', flag: '🇷🇺', continent: 'Europe/Asia', economy: 60, military: 90, population: 45, stability: 65, isPlayer: false, isAlly: false, isEnemy: true, color: '#DC2626', territories: ['russia-west', 'russia-east'] },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', continent: 'Europe', economy: 75, military: 70, population: 25, stability: 85, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['uk'] },
  { id: 'france', name: 'France', flag: '🇫🇷', continent: 'Europe', economy: 70, military: 65, population: 25, stability: 80, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['france'] },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', continent: 'Europe', economy: 80, military: 60, population: 30, stability: 90, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['germany'] },
  { id: 'india', name: 'India', flag: '🇮🇳', continent: 'Asia', economy: 65, military: 75, population: 95, stability: 70, isPlayer: false, isAlly: false, isEnemy: false, color: '#6B7280', territories: ['india'] },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', continent: 'Asia', economy: 85, military: 55, population: 40, stability: 95, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['japan'] },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', continent: 'North America', economy: 70, military: 50, population: 15, stability: 95, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['canada'] },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷', continent: 'South America', economy: 60, military: 45, population: 70, stability: 65, isPlayer: false, isAlly: false, isEnemy: false, color: '#6B7280', territories: ['brazil'] },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', continent: 'Oceania', economy: 65, military: 40, population: 10, stability: 90, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['australia'] },
]

const INITIAL_ALLIANCES: Alliance[] = [
  { id: 'nato', name: 'NATO Alliance', members: ['usa', 'uk', 'france', 'germany', 'canada'], strength: 85 },
  { id: 'eastern', name: 'Eastern Bloc', members: ['china', 'russia'], strength: 75 },
]

function App() {
  const [nations, setNations] = useState<Nation[]>(INITIAL_NATIONS)
  const [territories, setTerritories] = useState<Territory[]>(INITIAL_TERRITORIES)
  const [alliances, setAlliances] = useState<Alliance[]>(INITIAL_ALLIANCES)
  const [events, setEvents] = useState<GameEvent[]>([])
  const [selectedNation, setSelectedNation] = useState<Nation | null>(nations[0])
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null)
  const [gamePhase, setGamePhase] = useState<'preparation' | 'conflict' | 'resolution'>('preparation')
  const [turn, setTurn] = useState(1)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [globalTension, setGlobalTension] = useState(45)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [warMode, setWarMode] = useState(false)
  const [activeWars, setActiveWars] = useState<WarAction[]>([])

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
    processWars()
    
    if (turn >= 10) {
      setGamePhase('resolution')
    } else if (turn >= 5) {
      setGamePhase('conflict')
    }
  }

  const processWars = () => {
    setActiveWars(prev => prev.map(war => {
      if (war.result === 'ongoing') {
        const outcome = Math.random() > 0.5 ? 'victory' : 'defeat'
        if (outcome === 'victory') {
          captureTerritory(war.territoryId, war.attackerId)
        }
        return { ...war, result: outcome }
      }
      return war
    }))
  }

  const captureTerritory = (territoryId: string, newOwnerId: string) => {
    setTerritories(prev => prev.map(territory => 
      territory.id === territoryId 
        ? { ...territory, owner: newOwnerId }
        : territory
    ))

    // Update nation territories
    setNations(prev => prev.map(nation => {
      if (nation.id === newOwnerId) {
        return { ...nation, territories: [...nation.territories, territoryId] }
      } else if (nation.territories.includes(territoryId)) {
        return { ...nation, territories: nation.territories.filter(t => t !== territoryId) }
      }
      return nation
    }))

    const territory = territories.find(t => t.id === territoryId)
    const attacker = nations.find(n => n.id === newOwnerId)
    
    if (territory && attacker) {
      const newEvent: GameEvent = {
        id: `capture-${Date.now()}`,
        title: 'Territory Captured!',
        description: `${attacker.name} has successfully captured ${territory.name}`,
        type: 'war',
        timestamp: Date.now(),
        severity: 'high'
      }
      setEvents(prev => [newEvent, ...prev.slice(0, 4)])
      setGlobalTension(prev => Math.min(100, prev + 15))
    }
  }

  const attackTerritory = (territoryId: string) => {
    if (!selectedNation || !warMode) return
    
    const territory = territories.find(t => t.id === territoryId)
    const defender = nations.find(n => n.id === territory?.owner)
    
    if (!territory || !defender || territory.owner === selectedNation.id) return

    const attackerStrength = selectedNation.military + Math.random() * 20
    const defenderStrength = territory.defenseStrength + defender.military * 0.5 + Math.random() * 20

    const war: WarAction = {
      attackerId: selectedNation.id,
      defenderId: territory.owner,
      territoryId,
      attackerStrength,
      defenderStrength,
      result: 'ongoing'
    }

    setActiveWars(prev => [...prev, war])

    const newEvent: GameEvent = {
      id: `war-${Date.now()}`,
      title: 'War Declared!',
      description: `${selectedNation.name} has launched an attack on ${territory.name} (${defender.name})`,
      type: 'war',
      timestamp: Date.now(),
      severity: 'critical'
    }
    setEvents(prev => [newEvent, ...prev.slice(0, 4)])
    setGlobalTension(prev => Math.min(100, prev + 20))

    // Reduce attacker's military strength
    setNations(prev => prev.map(nation => 
      nation.id === selectedNation.id 
        ? { ...nation, military: Math.max(0, nation.military - 5) }
        : nation
    ))
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
    setNations(prev => prev.map(nation => (({
      ...nation,
      economy: Math.max(0, Math.min(100, nation.economy + (Math.random() - 0.5) * 10)),
      military: Math.max(0, Math.min(100, nation.military + (Math.random() - 0.5) * 5)),
      stability: Math.max(0, Math.min(100, nation.stability + (Math.random() - 0.5) * 8)),
    }))))
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

  const getNationColor = (nationId: string) => {
    const nation = nations.find(n => n.id === nationId)
    return nation?.color || '#6B7280'
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
              A strategic simulation of global conflict and territorial conquest
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Military Strategy</h3>
                <p className="text-sm text-muted-foreground">Deploy forces and capture territories</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Handshake className="h-8 w-8 text-accent mx-auto mb-2" />
                <h3 className="font-semibold">Diplomacy</h3>
                <p className="text-sm text-muted-foreground">Form alliances and negotiate</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Territory Control</h3>
                <p className="text-sm text-muted-foreground">Conquer and defend territories</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Target className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-semibold">Victory</h3>
                <p className="text-sm text-muted-foreground">Achieve global dominance</p>
              </div>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is a strategic simulation game. Capture territories through warfare to expand your empire and achieve victory.
              </AlertDescription>
            </Alert>
            
            <Button onClick={startGame} className="w-full" size="lg">
              <Crown className="h-5 w-5 mr-2" />
              Begin World Conquest
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

              <Button 
                onClick={() => setWarMode(!warMode)} 
                variant={warMode ? "destructive" : "outline"}
                size="sm"
              >
                <Crosshair className="h-4 w-4 mr-2" />
                {warMode ? 'Exit War Mode' : 'War Mode'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* World Map */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  World Map
                  {warMode && (
                    <Badge variant="destructive" className="ml-2">
                      <Crosshair className="h-3 w-3 mr-1" />
                      WAR MODE
                    </Badge>
                  )}
                </CardTitle>
                {warMode && (
                  <p className="text-sm text-muted-foreground">
                    Click on enemy territories to attack and capture them
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 bg-slate-900 rounded-lg overflow-hidden border-2">
                  {/* World Map SVG */}
                  <svg viewBox="0 0 100 70" className="w-full h-full">
                    {/* Ocean background */}
                    <rect width="100" height="70" fill="#1e293b" />
                    
                    {/* Continents outline */}
                    <path d="M5,15 L25,15 L25,40 L5,40 Z" fill="#334155" opacity="0.3" />
                    <path d="M45,18 L70,18 L70,45 L45,45 Z" fill="#334155" opacity="0.3" />
                    <path d="M65,25 L85,25 L85,50 L65,50 Z" fill="#334155" opacity="0.3" />
                    <path d="M20,45 L40,45 L40,65 L20,65 Z" fill="#334155" opacity="0.3" />
                    <path d="M45,35 L65,35 L65,65 L45,65 Z" fill="#334155" opacity="0.3" />
                    <path d="M75,50 L90,50 L90,60 L75,60 Z" fill="#334155" opacity="0.3" />
                    
                    {/* Territories */}
                    {territories.map(territory => {
                      const isSelected = selectedTerritory?.id === territory.id
                      const isPlayerTerritory = selectedNation?.territories.includes(territory.id)
                      const canAttack = warMode && selectedNation && territory.owner !== selectedNation.id
                      
                      return (
                        <g key={territory.id}>
                          <rect
                            x={territory.x}
                            y={territory.y}
                            width={territory.width}
                            height={territory.height}
                            fill={getNationColor(territory.owner)}
                            stroke={isSelected ? "#F59E0B" : "#1e293b"}
                            strokeWidth={isSelected ? "0.5" : "0.2"}
                            opacity={canAttack ? 0.8 : 0.9}
                            className={`transition-all duration-200 ${
                              canAttack ? 'cursor-crosshair hover:opacity-100' : 'cursor-pointer hover:opacity-100'
                            }`}
                            onClick={() => {
                              if (canAttack) {
                                attackTerritory(territory.id)
                              } else {
                                setSelectedTerritory(territory)
                              }
                            }}
                          />
                          {/* Territory name */}
                          <text
                            x={territory.x + territory.width / 2}
                            y={territory.y + territory.height / 2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="1.2"
                            fill="white"
                            className="pointer-events-none font-bold"
                          >
                            {territory.name.split(' ')[0]}
                          </text>
                          {/* Capital indicator */}
                          {territory.isCapital && (
                            <circle
                              cx={territory.x + territory.width - 1}
                              cy={territory.y + 1}
                              r="0.8"
                              fill="#F59E0B"
                              className="pointer-events-none"
                            />
                          )}
                          {/* War indicator */}
                          {activeWars.some(war => war.territoryId === territory.id && war.result === 'ongoing') && (
                            <circle
                              cx={territory.x + territory.width / 2}
                              cy={territory.y + territory.height / 2}
                              r="1.5"
                              fill="none"
                              stroke="#EF4444"
                              strokeWidth="0.3"
                              className="animate-pulse"
                            />
                          )}
                        </g>
                      )
                    })}
                  </svg>
                </div>
                
                {/* Territory Info */}
                {selectedTerritory && (
                  <div className="mt-4 p-4 border rounded-lg bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{selectedTerritory.name}</h3>
                      <div className="flex items-center gap-2">
                        {selectedTerritory.isCapital && (
                          <Badge variant="outline">
                            <Crown className="h-3 w-3 mr-1" />
                            Capital
                          </Badge>
                        )}
                        <Badge style={{ backgroundColor: getNationColor(selectedTerritory.owner) }}>
                          {nations.find(n => n.id === selectedTerritory.owner)?.name}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Population</p>
                        <p className="font-semibold">{selectedTerritory.population}M</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Resources</p>
                        <p className="font-semibold">{selectedTerritory.resources}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Defense</p>
                        <p className="font-semibold">{selectedTerritory.defenseStrength}%</p>
                      </div>
                    </div>
                    {warMode && selectedNation && selectedTerritory.owner !== selectedNation.id && (
                      <Button 
                        onClick={() => attackTerritory(selectedTerritory.id)}
                        variant="destructive" 
                        size="sm" 
                        className="mt-3 w-full"
                      >
                        <Sword className="h-4 w-4 mr-2" />
                        Attack Territory
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Wars */}
            {activeWars.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sword className="h-5 w-5 text-red-500" />
                    Active Conflicts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeWars.slice(0, 5).map((war, index) => {
                      const territory = territories.find(t => t.id === war.territoryId)
                      const attacker = nations.find(n => n.id === war.attackerId)
                      const defender = nations.find(n => n.id === war.defenderId)
                      
                      return (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">
                              Battle for {territory?.name}
                            </h4>
                            <Badge 
                              variant={war.result === 'victory' ? 'default' : 
                                     war.result === 'defeat' ? 'destructive' : 'secondary'}
                            >
                              {war.result === 'ongoing' ? 'In Progress' : 
                               war.result === 'victory' ? 'Victory' : 'Defeat'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>{attacker?.flag} {attacker?.name}</span>
                            <span className="text-muted-foreground">vs</span>
                            <span>{defender?.flag} {defender?.name}</span>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Attacker Strength</p>
                              <p className="font-semibold">{Math.round(war.attackerStrength)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Defender Strength</p>
                              <p className="font-semibold">{Math.round(war.defenderStrength)}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Nation Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Nations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {nations.map(nation => (
                    <div
                      key={nation.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedNation?.id === nation.id ? 'ring-2 ring-primary' : ''
                      } ${nation.isPlayer ? 'bg-blue-500/10' : nation.isAlly ? 'bg-green-500/10' : nation.isEnemy ? 'bg-red-500/10' : 'bg-muted/50'}`}
                      onClick={() => setSelectedNation(nation)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{nation.flag}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{nation.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {nation.territories.length} territories
                          </p>
                        </div>
                        {nation.isPlayer && <Crown className="h-4 w-4 text-primary" />}
                      </div>
                      
                      <div className="space-y-1">
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

            {/* Command Center */}
            {selectedNation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {selectedNation.name} Command
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="diplomacy">Diplomacy</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 border rounded-lg">
                          <Shield className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                          <div className="text-lg font-bold">{selectedNation.military}%</div>
                          <p className="text-xs text-muted-foreground">Military</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <MapPin className="h-5 w-5 text-green-500 mx-auto mb-1" />
                          <div className="text-lg font-bold">{selectedNation.territories.length}</div>
                          <p className="text-xs text-muted-foreground">Territories</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <Coins className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                          <div className="text-lg font-bold">{selectedNation.economy}%</div>
                          <p className="text-xs text-muted-foreground">Economy</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                          <Zap className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                          <div className="text-lg font-bold">{selectedNation.stability}%</div>
                          <p className="text-xs text-muted-foreground">Stability</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="diplomacy" className="space-y-3">
                      <div className="grid grid-cols-1 gap-2">
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
                  Global News
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
                  Victory Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Territories Controlled</span>
                    <span className="text-sm font-mono">
                      {selectedNation?.territories.length || 0}/{territories.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Military Strength</span>
                    <span className="text-sm font-mono">{selectedNation?.military || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Global Stability</span>
                    <span className="text-sm font-mono">{100 - globalTension}%</span>
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
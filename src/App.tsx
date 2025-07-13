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
  Crosshair,
  Plane,
  Ship,
  Tank,
  Bomb,
  Radio,
  Eye
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
  strategicValue: number
  hasPort: boolean
  hasAirbase: boolean
  terrain: 'plains' | 'mountains' | 'desert' | 'forest' | 'coastal' | 'island'
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
  nuclearWeapons: number
  airForce: number
  navy: number
  army: number
}

interface GameEvent {
  id: string
  title: string
  description: string
  type: 'diplomatic' | 'military' | 'economic' | 'crisis' | 'war' | 'nuclear'
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
  id: string
  attackerId: string
  defenderId: string
  territoryId: string
  attackerStrength: number
  defenderStrength: number
  result: 'victory' | 'defeat' | 'ongoing'
  warType: 'ground' | 'air' | 'naval' | 'nuclear'
  casualties: number
  duration: number
}

interface MilitaryUnit {
  id: string
  type: 'army' | 'navy' | 'airforce' | 'nuclear'
  strength: number
  location: string
  status: 'ready' | 'deployed' | 'damaged'
}

// More realistic world territories with accurate positioning
const INITIAL_TERRITORIES: Territory[] = [
  // North America
  { id: 'usa-east', name: 'Eastern USA', x: 15, y: 25, width: 12, height: 8, owner: 'usa', population: 180, resources: 85, defenseStrength: 95, isCapital: true, continent: 'North America', strategicValue: 100, hasPort: true, hasAirbase: true, terrain: 'coastal' },
  { id: 'usa-west', name: 'Western USA', x: 5, y: 25, width: 10, height: 8, owner: 'usa', population: 120, resources: 70, defenseStrength: 90, isCapital: false, continent: 'North America', strategicValue: 85, hasPort: true, hasAirbase: true, terrain: 'coastal' },
  { id: 'usa-central', name: 'Central USA', x: 10, y: 20, width: 8, height: 10, owner: 'usa', population: 100, resources: 80, defenseStrength: 80, isCapital: false, continent: 'North America', strategicValue: 70, hasPort: false, hasAirbase: true, terrain: 'plains' },
  { id: 'canada', name: 'Canada', x: 8, y: 10, width: 18, height: 12, owner: 'canada', population: 40, resources: 95, defenseStrength: 70, isCapital: true, continent: 'North America', strategicValue: 60, hasPort: true, hasAirbase: true, terrain: 'forest' },
  { id: 'mexico', name: 'Mexico', x: 10, y: 33, width: 8, height: 5, owner: 'mexico', population: 130, resources: 45, defenseStrength: 50, isCapital: true, continent: 'North America', strategicValue: 40, hasPort: true, hasAirbase: false, terrain: 'desert' },
  
  // Europe
  { id: 'uk', name: 'United Kingdom', x: 45, y: 18, width: 4, height: 6, owner: 'uk', population: 67, resources: 60, defenseStrength: 90, isCapital: true, continent: 'Europe', strategicValue: 95, hasPort: true, hasAirbase: true, terrain: 'island' },
  { id: 'france', name: 'France', x: 47, y: 23, width: 5, height: 6, owner: 'france', population: 68, resources: 65, defenseStrength: 85, isCapital: true, continent: 'Europe', strategicValue: 85, hasPort: true, hasAirbase: true, terrain: 'coastal' },
  { id: 'germany', name: 'Germany', x: 50, y: 20, width: 5, height: 6, owner: 'germany', population: 83, resources: 70, defenseStrength: 90, isCapital: true, continent: 'Europe', strategicValue: 90, hasPort: false, hasAirbase: true, terrain: 'plains' },
  { id: 'russia-west', name: 'Western Russia', x: 55, y: 15, width: 15, height: 12, owner: 'russia', population: 80, resources: 100, defenseStrength: 100, isCapital: true, continent: 'Europe', strategicValue: 100, hasPort: true, hasAirbase: true, terrain: 'plains' },
  { id: 'ukraine', name: 'Ukraine', x: 52, y: 23, width: 6, height: 4, owner: 'ukraine', population: 44, resources: 55, defenseStrength: 75, isCapital: true, continent: 'Europe', strategicValue: 70, hasPort: true, hasAirbase: true, terrain: 'plains' },
  { id: 'poland', name: 'Poland', x: 50, y: 19, width: 4, height: 4, owner: 'poland', population: 38, resources: 50, defenseStrength: 70, isCapital: true, continent: 'Europe', strategicValue: 65, hasPort: true, hasAirbase: true, terrain: 'plains' },
  { id: 'scandinavia', name: 'Scandinavia', x: 48, y: 10, width: 8, height: 8, owner: 'norway', population: 25, resources: 80, defenseStrength: 60, isCapital: true, continent: 'Europe', strategicValue: 55, hasPort: true, hasAirbase: true, terrain: 'forest' },
  
  // Asia
  { id: 'russia-east', name: 'Eastern Russia', x: 70, y: 12, width: 18, height: 15, owner: 'russia', population: 65, resources: 100, defenseStrength: 85, isCapital: false, continent: 'Asia', strategicValue: 80, hasPort: true, hasAirbase: true, terrain: 'forest' },
  { id: 'china-north', name: 'Northern China', x: 70, y: 22, width: 12, height: 8, owner: 'china', population: 400, resources: 80, defenseStrength: 100, isCapital: true, continent: 'Asia', strategicValue: 100, hasPort: false, hasAirbase: true, terrain: 'plains' },
  { id: 'china-south', name: 'Southern China', x: 72, y: 30, width: 10, height: 8, owner: 'china', population: 600, resources: 75, defenseStrength: 95, isCapital: false, continent: 'Asia', strategicValue: 90, hasPort: true, hasAirbase: true, terrain: 'coastal' },
  { id: 'india', name: 'India', x: 65, y: 32, width: 8, height: 10, owner: 'india', population: 1400, resources: 60, defenseStrength: 90, isCapital: true, continent: 'Asia', strategicValue: 85, hasPort: true, hasAirbase: true, terrain: 'plains' },
  { id: 'japan', name: 'Japan', x: 84, y: 26, width: 4, height: 6, owner: 'japan', population: 125, resources: 55, defenseStrength: 85, isCapital: true, continent: 'Asia', strategicValue: 80, hasPort: true, hasAirbase: true, terrain: 'island' },
  { id: 'korea', name: 'Korea', x: 82, y: 24, width: 3, height: 4, owner: 'korea', population: 77, resources: 50, defenseStrength: 80, isCapital: true, continent: 'Asia', strategicValue: 75, hasPort: true, hasAirbase: true, terrain: 'coastal' },
  { id: 'southeast-asia', name: 'Southeast Asia', x: 75, y: 35, width: 8, height: 8, owner: 'thailand', population: 200, resources: 65, defenseStrength: 60, isCapital: true, continent: 'Asia', strategicValue: 60, hasPort: true, hasAirbase: true, terrain: 'coastal' },
  
  // Middle East
  { id: 'iran', name: 'Iran', x: 58, y: 30, width: 6, height: 6, owner: 'iran', population: 85, resources: 90, defenseStrength: 80, isCapital: true, continent: 'Middle East', strategicValue: 85, hasPort: true, hasAirbase: true, terrain: 'desert' },
  { id: 'saudi', name: 'Saudi Arabia', x: 55, y: 33, width: 6, height: 8, owner: 'saudi', population: 35, resources: 100, defenseStrength: 65, isCapital: true, continent: 'Middle East', strategicValue: 80, hasPort: true, hasAirbase: true, terrain: 'desert' },
  { id: 'turkey', name: 'Turkey', x: 52, y: 27, width: 5, height: 4, owner: 'turkey', population: 85, resources: 55, defenseStrength: 75, isCapital: true, continent: 'Middle East', strategicValue: 75, hasPort: true, hasAirbase: true, terrain: 'mountains' },
  { id: 'israel', name: 'Israel', x: 53, y: 31, width: 2, height: 2, owner: 'israel', population: 9, resources: 40, defenseStrength: 95, isCapital: true, continent: 'Middle East', strategicValue: 70, hasPort: true, hasAirbase: true, terrain: 'desert' },
  
  // Africa
  { id: 'egypt', name: 'Egypt', x: 52, y: 35, width: 4, height: 6, owner: 'egypt', population: 104, resources: 45, defenseStrength: 60, isCapital: true, continent: 'Africa', strategicValue: 65, hasPort: true, hasAirbase: true, terrain: 'desert' },
  { id: 'south-africa', name: 'South Africa', x: 50, y: 52, width: 6, height: 6, owner: 'south-africa', population: 60, resources: 75, defenseStrength: 55, isCapital: true, continent: 'Africa', strategicValue: 50, hasPort: true, hasAirbase: true, terrain: 'plains' },
  { id: 'nigeria', name: 'Nigeria', x: 45, y: 42, width: 5, height: 5, owner: 'nigeria', population: 220, resources: 70, defenseStrength: 45, isCapital: true, continent: 'Africa', strategicValue: 45, hasPort: true, hasAirbase: false, terrain: 'plains' },
  
  // South America
  { id: 'brazil', name: 'Brazil', x: 25, y: 42, width: 15, height: 15, owner: 'brazil', population: 215, resources: 85, defenseStrength: 70, isCapital: true, continent: 'South America', strategicValue: 70, hasPort: true, hasAirbase: true, terrain: 'forest' },
  { id: 'argentina', name: 'Argentina', x: 22, y: 52, width: 8, height: 10, owner: 'argentina', population: 45, resources: 70, defenseStrength: 50, isCapital: true, continent: 'South America', strategicValue: 45, hasPort: true, hasAirbase: true, terrain: 'plains' },
  
  // Oceania
  { id: 'australia', name: 'Australia', x: 75, y: 48, width: 12, height: 10, owner: 'australia', population: 26, resources: 90, defenseStrength: 70, isCapital: true, continent: 'Oceania', strategicValue: 60, hasPort: true, hasAirbase: true, terrain: 'desert' },
]

const INITIAL_NATIONS: Nation[] = [
  { id: 'usa', name: 'United States', flag: '🇺🇸', continent: 'North America', economy: 95, military: 100, population: 85, stability: 85, isPlayer: true, isAlly: false, isEnemy: false, color: '#3B82F6', territories: ['usa-east', 'usa-west', 'usa-central'], nuclearWeapons: 100, airForce: 95, navy: 100, army: 90 },
  { id: 'china', name: 'China', flag: '🇨🇳', continent: 'Asia', economy: 90, military: 95, population: 100, stability: 75, isPlayer: false, isAlly: false, isEnemy: true, color: '#EF4444', territories: ['china-north', 'china-south'], nuclearWeapons: 80, airForce: 85, navy: 70, army: 100 },
  { id: 'russia', name: 'Russia', flag: '🇷🇺', continent: 'Europe/Asia', economy: 60, military: 90, population: 45, stability: 65, isPlayer: false, isAlly: false, isEnemy: true, color: '#DC2626', territories: ['russia-west', 'russia-east'], nuclearWeapons: 120, airForce: 80, navy: 60, army: 85 },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', continent: 'Europe', economy: 75, military: 75, population: 25, stability: 90, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['uk'], nuclearWeapons: 40, airForce: 80, navy: 85, army: 65 },
  { id: 'france', name: 'France', flag: '🇫🇷', continent: 'Europe', economy: 70, military: 70, population: 25, stability: 85, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['france'], nuclearWeapons: 35, airForce: 75, navy: 70, army: 70 },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', continent: 'Europe', economy: 80, military: 65, population: 30, stability: 95, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['germany'], nuclearWeapons: 0, airForce: 70, navy: 40, army: 75 },
  { id: 'india', name: 'India', flag: '🇮🇳', continent: 'Asia', economy: 65, military: 80, population: 95, stability: 70, isPlayer: false, isAlly: false, isEnemy: false, color: '#6B7280', territories: ['india'], nuclearWeapons: 25, airForce: 70, navy: 60, army: 85 },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', continent: 'Asia', economy: 85, military: 60, population: 40, stability: 95, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['japan'], nuclearWeapons: 0, airForce: 75, navy: 80, army: 50 },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', continent: 'North America', economy: 70, military: 55, population: 15, stability: 95, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['canada'], nuclearWeapons: 0, airForce: 60, navy: 50, army: 55 },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷', continent: 'South America', economy: 60, military: 50, population: 70, stability: 65, isPlayer: false, isAlly: false, isEnemy: false, color: '#6B7280', territories: ['brazil'], nuclearWeapons: 0, airForce: 45, navy: 40, army: 55 },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', continent: 'Oceania', economy: 65, military: 45, population: 10, stability: 90, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['australia'], nuclearWeapons: 0, airForce: 50, navy: 60, army: 40 },
  { id: 'iran', name: 'Iran', flag: '🇮🇷', continent: 'Middle East', economy: 45, military: 70, population: 35, stability: 60, isPlayer: false, isAlly: false, isEnemy: true, color: '#DC2626', territories: ['iran'], nuclearWeapons: 5, airForce: 60, navy: 40, army: 75 },
  { id: 'israel', name: 'Israel', flag: '🇮🇱', continent: 'Middle East', economy: 60, military: 85, population: 5, stability: 75, isPlayer: false, isAlly: true, isEnemy: false, color: '#10B981', territories: ['israel'], nuclearWeapons: 15, airForce: 90, navy: 60, army: 80 },
]

const INITIAL_ALLIANCES: Alliance[] = [
  { id: 'nato', name: 'NATO Alliance', members: ['usa', 'uk', 'france', 'germany', 'canada'], strength: 90 },
  { id: 'eastern', name: 'Eastern Bloc', members: ['china', 'russia', 'iran'], strength: 80 },
  { id: 'quad', name: 'QUAD Alliance', members: ['usa', 'japan', 'india', 'australia'], strength: 70 },
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
  const [militaryUnits, setMilitaryUnits] = useState<MilitaryUnit[]>([])
  const [nuclearThreat, setNuclearThreat] = useState(0)
  const [selectedWarType, setSelectedWarType] = useState<'ground' | 'air' | 'naval' | 'nuclear'>('ground')

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
    updateNuclearThreat()
    
    if (turn >= 15) {
      setGamePhase('resolution')
    } else if (turn >= 8) {
      setGamePhase('conflict')
    }
  }

  const updateNuclearThreat = () => {
    const totalNukes = nations.reduce((sum, nation) => sum + nation.nuclearWeapons, 0)
    const threatLevel = Math.min(100, (totalNukes / 10) + globalTension * 0.3)
    setNuclearThreat(threatLevel)
  }

  const processWars = () => {
    setActiveWars(prev => prev.map(war => {
      if (war.result === 'ongoing') {
        war.duration += 1
        
        // Calculate battle outcome based on war type and nation capabilities
        const attacker = nations.find(n => n.id === war.attackerId)
        const defender = nations.find(n => n.id === war.defenderId)
        const territory = territories.find(t => t.id === war.territoryId)
        
        if (!attacker || !defender || !territory) return war
        
        let attackerAdvantage = 0
        let defenderAdvantage = territory.defenseStrength * 0.1
        
        // War type advantages
        switch (war.warType) {
          case 'air':
            attackerAdvantage = attacker.airForce * 0.8
            defenderAdvantage += defender.airForce * 0.6
            break
          case 'naval':
            attackerAdvantage = attacker.navy * 0.8
            defenderAdvantage += defender.navy * 0.6
            if (!territory.hasPort) defenderAdvantage += 20
            break
          case 'nuclear':
            attackerAdvantage = attacker.nuclearWeapons * 2
            defenderAdvantage = 0 // Nuclear attacks are devastating
            war.casualties = Math.floor(territory.population * 0.3)
            break
          default: // ground
            attackerAdvantage = attacker.army * 0.8
            defenderAdvantage += defender.army * 0.6
            if (territory.terrain === 'mountains') defenderAdvantage += 15
            if (territory.terrain === 'forest') defenderAdvantage += 10
        }
        
        const totalAttackerStrength = war.attackerStrength + attackerAdvantage + Math.random() * 20
        const totalDefenderStrength = war.defenderStrength + defenderAdvantage + Math.random() * 20
        
        if (totalAttackerStrength > totalDefenderStrength * 1.2) {
          war.result = 'victory'
          captureTerritory(war.territoryId, war.attackerId, war.warType)
        } else if (totalDefenderStrength > totalAttackerStrength * 1.3) {
          war.result = 'defeat'
        }
        
        // Calculate casualties
        const baseCasualties = Math.floor(Math.random() * 10000)
        war.casualties += baseCasualties
        
        // Reduce military strength for both sides
        setNations(prev => prev.map(nation => {
          if (nation.id === war.attackerId) {
            const reduction = war.warType === 'nuclear' ? 2 : 5
            return { ...nation, military: Math.max(0, nation.military - reduction) }
          } else if (nation.id === war.defenderId) {
            const reduction = war.warType === 'nuclear' ? 10 : 3
            return { ...nation, military: Math.max(0, nation.military - reduction) }
          }
          return nation
        }))
      }
      return war
    }))
  }

  const captureTerritory = (territoryId: string, newOwnerId: string, warType: string) => {
    setTerritories(prev => prev.map(territory => 
      territory.id === territoryId 
        ? { ...territory, owner: newOwnerId, defenseStrength: Math.max(20, territory.defenseStrength - 20) }
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
      const warTypeText = warType === 'nuclear' ? 'Nuclear Strike' : 
                         warType === 'air' ? 'Air Campaign' :
                         warType === 'naval' ? 'Naval Invasion' : 'Ground Assault'
      
      const newEvent: GameEvent = {\n        id: `capture-${Date.now()}`,
        title: `Territory Captured via ${warTypeText}!`,
        description: `${attacker.name} has successfully captured ${territory.name} through ${warTypeText.toLowerCase()}`,
        type: warType === 'nuclear' ? 'nuclear' : 'war',
        timestamp: Date.now(),
        severity: warType === 'nuclear' ? 'critical' : 'high'
      }
      setEvents(prev => [newEvent, ...prev.slice(0, 4)])
      
      const tensionIncrease = warType === 'nuclear' ? 30 : 15
      setGlobalTension(prev => Math.min(100, prev + tensionIncrease))
    }
  }

  const attackTerritory = (territoryId: string) => {
    if (!selectedNation || !warMode) return
    
    const territory = territories.find(t => t.id === territoryId)
    const defender = nations.find(n => n.id === territory?.owner)
    
    if (!territory || !defender || territory.owner === selectedNation.id) return

    // Check if nuclear attack is possible
    if (selectedWarType === 'nuclear' && selectedNation.nuclearWeapons === 0) {
      const newEvent: GameEvent = {
        id: `no-nukes-${Date.now()}`,
        title: 'Nuclear Attack Failed',
        description: `${selectedNation.name} attempted a nuclear strike but has no nuclear weapons available`,
        type: 'military',
        timestamp: Date.now(),
        severity: 'medium'
      }
      setEvents(prev => [newEvent, ...prev.slice(0, 4)])
      return
    }

    let attackerStrength = selectedNation.military
    let warTypeMultiplier = 1

    // Apply war type modifiers
    switch (selectedWarType) {
      case 'air':
        attackerStrength = selectedNation.airForce
        warTypeMultiplier = territory.hasAirbase ? 0.8 : 1.2
        break
      case 'naval':
        attackerStrength = selectedNation.navy
        warTypeMultiplier = territory.hasPort ? 1.2 : 0.6
        break
      case 'nuclear':
        attackerStrength = selectedNation.nuclearWeapons * 5
        warTypeMultiplier = 2.0
        // Reduce nuclear weapons
        setNations(prev => prev.map(nation => 
          nation.id === selectedNation.id 
            ? { ...nation, nuclearWeapons: Math.max(0, nation.nuclearWeapons - 1) }
            : nation
        ))
        break
      default: // ground
        attackerStrength = selectedNation.army
        warTypeMultiplier = territory.terrain === 'mountains' ? 0.7 : 
                           territory.terrain === 'forest' ? 0.8 : 1.0
    }

    const finalAttackerStrength = attackerStrength * warTypeMultiplier + Math.random() * 20
    const defenderStrength = territory.defenseStrength + defender.military * 0.5 + Math.random() * 20

    const war: WarAction = {
      id: `war-${Date.now()}`,
      attackerId: selectedNation.id,
      defenderId: territory.owner,
      territoryId,
      attackerStrength: finalAttackerStrength,
      defenderStrength,
      result: 'ongoing',
      warType: selectedWarType,
      casualties: 0,
      duration: 0
    }

    setActiveWars(prev => [...prev, war])

    const warTypeText = selectedWarType === 'nuclear' ? 'Nuclear Strike' : 
                       selectedWarType === 'air' ? 'Air Strike' :
                       selectedWarType === 'naval' ? 'Naval Attack' : 'Ground Assault'

    const newEvent: GameEvent = {
      id: `war-${Date.now()}`,
      title: `${warTypeText} Launched!`,
      description: `${selectedNation.name} has launched a ${warTypeText.toLowerCase()} on ${territory.name} (${defender.name})`,
      type: selectedWarType === 'nuclear' ? 'nuclear' : 'war',
      timestamp: Date.now(),
      severity: selectedWarType === 'nuclear' ? 'critical' : 'high'
    }
    setEvents(prev => [newEvent, ...prev.slice(0, 4)])
    
    const tensionIncrease = selectedWarType === 'nuclear' ? 25 : 20
    setGlobalTension(prev => Math.min(100, prev + tensionIncrease))
  }

  const generateRandomEvent = () => {
    const eventTypes = ['diplomatic', 'military', 'economic', 'crisis'] as const
    const severities = ['low', 'medium', 'high', 'critical'] as const
    
    const events = [
      { title: 'Cyber Warfare Escalates', description: 'Major infrastructure targeted by state-sponsored hackers', type: 'crisis' },
      { title: 'Nuclear Submarine Detected', description: 'Unidentified nuclear submarine spotted in international waters', type: 'military' },
      { title: 'Trade War Intensifies', description: 'New tariffs imposed on critical technology exports', type: 'economic' },
      { title: 'Diplomatic Crisis Emerges', description: 'Ambassador recalled amid escalating tensions', type: 'diplomatic' },
      { title: 'Military Exercises Begin', description: 'Large-scale joint military exercises near contested borders', type: 'military' },
      { title: 'Resource Blockade Imposed', description: 'Critical supply routes have been blocked', type: 'crisis' },
      { title: 'Intelligence Leak Exposed', description: 'Classified military documents have been leaked', type: 'crisis' },
      { title: 'Naval Standoff Reported', description: 'Warships from opposing nations face off in disputed waters', type: 'military' },
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
      economy: Math.max(0, Math.min(100, nation.economy + (Math.random() - 0.5) * 8)),
      military: Math.max(0, Math.min(100, nation.military + (Math.random() - 0.5) * 3)),
      stability: Math.max(0, Math.min(100, nation.stability + (Math.random() - 0.5) * 6)),
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

  const getTerrainIcon = (terrain: string) => {
    switch (terrain) {
      case 'mountains': return '⛰️'
      case 'desert': return '🏜️'
      case 'forest': return '🌲'
      case 'coastal': return '🏖️'
      case 'island': return '🏝️'
      default: return '🌾'
    }
  }

  if (!isGameStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold text-primary">World War 3 Simulator</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              A realistic strategic simulation of global conflict and territorial conquest
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Tank className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold">Ground Forces</h3>
                <p className="text-sm text-muted-foreground">Deploy armies and tanks</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Plane className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">Air Power</h3>
                <p className="text-sm text-muted-foreground">Control the skies</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Ship className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                <h3 className="font-semibold">Naval Warfare</h3>
                <p className="text-sm text-muted-foreground">Dominate the seas</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Bomb className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h3 className="font-semibold">Nuclear Option</h3>
                <p className="text-sm text-muted-foreground">Ultimate deterrent</p>
              </div>
            </div>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is a realistic military simulation. Choose your warfare strategy wisely - ground, air, naval, or nuclear operations each have unique advantages and consequences.
              </AlertDescription>
            </Alert>
            
            <Button onClick={startGame} className="w-full" size="lg">
              <Crown className="h-5 w-5 mr-2" />
              Begin Global Conflict Simulation
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

              <div className="text-center">
                <div className="flex items-center gap-2">
                  <Bomb className="h-4 w-4 text-red-500" />
                  <span className={`font-bold ${nuclearThreat >= 70 ? 'text-red-500' : nuclearThreat >= 40 ? 'text-orange-500' : 'text-green-500'}`}>
                    {Math.round(nuclearThreat)}%
                  </span>
                </div>
                <Progress value={nuclearThreat} className="w-24 h-2" />
                <p className="text-xs text-muted-foreground">Nuclear Threat</p>
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
                  Realistic World Map
                  {warMode && (
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="destructive">
                        <Crosshair className="h-3 w-3 mr-1" />
                        WAR MODE
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={selectedWarType === 'ground' ? 'default' : 'outline'}
                          onClick={() => setSelectedWarType('ground')}
                        >
                          <Tank className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedWarType === 'air' ? 'default' : 'outline'}
                          onClick={() => setSelectedWarType('air')}
                        >
                          <Plane className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedWarType === 'naval' ? 'default' : 'outline'}
                          onClick={() => setSelectedWarType('naval')}
                        >
                          <Ship className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={selectedWarType === 'nuclear' ? 'destructive' : 'outline'}
                          onClick={() => setSelectedWarType('nuclear')}
                        >
                          <Bomb className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardTitle>
                {warMode && (
                  <p className="text-sm text-muted-foreground">
                    Select warfare type and click on enemy territories to attack. {selectedWarType === 'nuclear' ? '⚠️ Nuclear strikes cause massive casualties!' : ''}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-[500px] bg-slate-900 rounded-lg overflow-hidden border-2">
                  {/* Realistic World Map SVG */}
                  <svg viewBox="0 0 100 70" className="w-full h-full">
                    {/* Ocean background */}
                    <rect width="100" height="70" fill="#1e293b" />
                    
                    {/* Continental outlines - more realistic */}
                    {/* North America */}
                    <path d="M5,10 Q8,8 15,10 L25,12 Q28,15 26,20 L28,35 Q25,38 20,36 L15,38 Q8,35 5,30 Z" fill="#334155" opacity="0.2" />
                    {/* Europe */}
                    <path d="M45,15 Q50,12 55,15 L58,18 Q60,22 58,28 L60,32 Q55,35 50,32 L45,30 Q42,25 45,20 Z" fill="#334155" opacity="0.2" />
                    {/* Asia */}
                    <path d="M60,10 Q75,8 85,12 L88,15 Q90,25 88,35 L85,45 Q80,48 70,45 L65,40 Q60,30 62,20 Z" fill="#334155" opacity="0.2" />
                    {/* Africa */}
                    <path d="M45,35 Q52,32 58,38 L60,45 Q58,55 55,60 L50,62 Q45,58 42,50 L40,42 Q42,38 45,35 Z" fill="#334155" opacity="0.2" />
                    {/* South America */}
                    <path d="M20,40 Q28,38 35,42 L38,50 Q35,60 30,65 L25,62 Q20,58 18,50 L16,45 Q18,42 20,40 Z" fill="#334155" opacity="0.2" />
                    {/* Australia */}
                    <path d="M75,48 Q82,46 88,50 L90,55 Q88,58 85,60 L78,58 Q75,55 73,52 Q73,50 75,48 Z" fill="#334155" opacity="0.2" />
                    
                    {/* Territories with realistic positioning */}
                    {territories.map(territory => {
                      const isSelected = selectedTerritory?.id === territory.id
                      const isPlayerTerritory = selectedNation?.territories.includes(territory.id)
                      const canAttack = warMode && selectedNation && territory.owner !== selectedNation.id
                      const isAtWar = activeWars.some(war => war.territoryId === territory.id && war.result === 'ongoing')
                      
                      return (
                        <g key={territory.id}>
                          <rect
                            x={territory.x}
                            y={territory.y}
                            width={territory.width}
                            height={territory.height}
                            fill={getNationColor(territory.owner)}
                            stroke={isSelected ? "#F59E0B" : isAtWar ? "#EF4444" : "#1e293b"}
                            strokeWidth={isSelected ? "0.5" : isAtWar ? "0.4" : "0.2"}
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
                            y={territory.y + territory.height / 2 - 0.5}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="1"
                            fill="white"
                            className="pointer-events-none font-bold"
                          >
                            {territory.name.split(' ')[0]}
                          </text>
                          
                          {/* Terrain indicator */}
                          <text
                            x={territory.x + territory.width / 2}
                            y={territory.y + territory.height / 2 + 1}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="0.8"
                            fill="white"
                            className="pointer-events-none"
                          >
                            {getTerrainIcon(territory.terrain)}
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
                          
                          {/* Military base indicators */}
                          {territory.hasAirbase && (
                            <circle
                              cx={territory.x + 1}
                              cy={territory.y + 1}
                              r="0.5"
                              fill="#3B82F6"
                              className="pointer-events-none"
                            />
                          )}
                          
                          {territory.hasPort && (
                            <circle
                              cx={territory.x + territory.width - 1}
                              cy={territory.y + territory.height - 1}
                              r="0.5"
                              fill="#06B6D4"
                              className="pointer-events-none"
                            />
                          )}
                          
                          {/* War indicator */}
                          {isAtWar && (
                            <g>
                              <circle
                                cx={territory.x + territory.width / 2}
                                cy={territory.y + territory.height / 2}
                                r="2"
                                fill="none"
                                stroke="#EF4444"
                                strokeWidth="0.3"
                                className="animate-pulse"
                              />
                              <text
                                x={territory.x + territory.width / 2}
                                y={territory.y + territory.height / 2}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="1.5"
                                fill="#EF4444"
                                className="pointer-events-none animate-pulse"
                              >
                                ⚔️
                              </text>
                            </g>
                          )}
                        </g>
                      )
                    })}
                  </svg>
                </div>
                
                {/* Territory Info */}
                {selectedTerritory && (
                  <div className="mt-4 p-4 border rounded-lg bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{selectedTerritory.name}</h3>
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
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
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
                      <div>
                        <p className="text-muted-foreground">Strategic Value</p>
                        <p className="font-semibold">{selectedTerritory.strategicValue}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <span>Terrain:</span>
                        <span>{getTerrainIcon(selectedTerritory.terrain)} {selectedTerritory.terrain}</span>
                      </div>
                      {selectedTerritory.hasAirbase && (
                        <Badge variant="outline">
                          <Plane className="h-3 w-3 mr-1" />
                          Airbase
                        </Badge>
                      )}
                      {selectedTerritory.hasPort && (
                        <Badge variant="outline">
                          <Ship className="h-3 w-3 mr-1" />
                          Naval Port
                        </Badge>
                      )}
                    </div>
                    
                    {warMode && selectedNation && selectedTerritory.owner !== selectedNation.id && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Attack Type:</span>
                          <Badge variant={selectedWarType === 'nuclear' ? 'destructive' : 'default'}>
                            {selectedWarType === 'ground' && <Tank className="h-3 w-3 mr-1" />}
                            {selectedWarType === 'air' && <Plane className="h-3 w-3 mr-1" />}
                            {selectedWarType === 'naval' && <Ship className="h-3 w-3 mr-1" />}
                            {selectedWarType === 'nuclear' && <Bomb className="h-3 w-3 mr-1" />}
                            {selectedWarType.charAt(0).toUpperCase() + selectedWarType.slice(1)}
                          </Badge>
                        </div>
                        <Button 
                          onClick={() => attackTerritory(selectedTerritory.id)}
                          variant={selectedWarType === 'nuclear' ? 'destructive' : 'default'}
                          size="sm" 
                          className="w-full"
                          disabled={selectedWarType === 'nuclear' && selectedNation.nuclearWeapons === 0}
                        >
                          {selectedWarType === 'ground' && <Tank className="h-4 w-4 mr-2" />}
                          {selectedWarType === 'air' && <Plane className="h-4 w-4 mr-2" />}
                          {selectedWarType === 'naval' && <Ship className="h-4 w-4 mr-2" />}
                          {selectedWarType === 'nuclear' && <Bomb className="h-4 w-4 mr-2" />}
                          Launch {selectedWarType.charAt(0).toUpperCase() + selectedWarType.slice(1)} Attack
                          {selectedWarType === 'nuclear' && ` (${selectedNation.nuclearWeapons} available)`}
                        </Button>
                      </div>
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
                    Active Military Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeWars.slice(0, 6).map((war, index) => {
                      const territory = territories.find(t => t.id === war.territoryId)
                      const attacker = nations.find(n => n.id === war.attackerId)
                      const defender = nations.find(n => n.id === war.defenderId)
                      
                      return (
                        <div key={war.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                              {war.warType === 'ground' && <Tank className="h-4 w-4" />}
                              {war.warType === 'air' && <Plane className="h-4 w-4" />}
                              {war.warType === 'naval' && <Ship className="h-4 w-4" />}
                              {war.warType === 'nuclear' && <Bomb className="h-4 w-4 text-red-500" />}
                              {war.warType.charAt(0).toUpperCase() + war.warType.slice(1)} Battle for {territory?.name}
                            </h4>
                            <Badge 
                              variant={war.result === 'victory' ? 'default' : 
                                     war.result === 'defeat' ? 'destructive' : 'secondary'}
                            >
                              {war.result === 'ongoing' ? `Day ${war.duration}` : 
                               war.result === 'victory' ? 'Victory' : 'Defeat'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>{attacker?.flag} {attacker?.name}</span>
                            <span className="text-muted-foreground">vs</span>
                            <span>{defender?.flag} {defender?.name}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Attacker Strength</p>
                              <p className="font-semibold">{Math.round(war.attackerStrength)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Defender Strength</p>
                              <p className="font-semibold">{Math.round(war.defenderStrength)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Casualties</p>
                              <p className="font-semibold text-red-500">{war.casualties.toLocaleString()}</p>
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
                  World Powers
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
                            {nation.territories.length} territories • {nation.nuclearWeapons} nukes
                          </p>
                        </div>
                        {nation.isPlayer && <Crown className="h-4 w-4 text-primary" />}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="flex justify-between">
                            <span>Military</span>
                            <span>{nation.military}%</span>
                          </div>
                          <Progress value={nation.military} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Economy</span>
                            <span>{nation.economy}%</span>
                          </div>
                          <Progress value={nation.economy} className="h-1" />
                        </div>
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
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="military">Military</TabsTrigger>
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
                          <Bomb className="h-5 w-5 text-red-500 mx-auto mb-1" />
                          <div className="text-lg font-bold">{selectedNation.nuclearWeapons}</div>
                          <p className="text-xs text-muted-foreground">Nuclear</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="military" className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Tank className="h-4 w-4" />
                            <span className="text-sm">Army</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={selectedNation.army} className="w-16 h-2" />
                            <span className="text-sm font-mono">{selectedNation.army}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Plane className="h-4 w-4" />
                            <span className="text-sm">Air Force</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={selectedNation.airForce} className="w-16 h-2" />
                            <span className="text-sm font-mono">{selectedNation.airForce}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Ship className="h-4 w-4" />
                            <span className="text-sm">Navy</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={selectedNation.navy} className="w-16 h-2" />
                            <span className="text-sm font-mono">{selectedNation.navy}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Bomb className="h-4 w-4 text-red-500" />
                            <span className="text-sm">Nuclear Arsenal</span>
                          </div>
                          <span className="text-sm font-mono">{selectedNation.nuclearWeapons} warheads</span>
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
                          <Handshake className="h-4 w-4 mr-2" />
                          Trade Agreement
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => performDiplomaticAction('Peace Treaty', 'Neutral Nations')}
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          Peace Treaty
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => performDiplomaticAction('Economic Sanctions', 'Enemy Nations')}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Sanctions
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => performDiplomaticAction('Nuclear Threat', 'Enemy Nations')}
                        >
                          <Bomb className="h-4 w-4 mr-2" />
                          Nuclear Threat
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Global Intelligence */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Global Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {events.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No recent intelligence</p>
                  ) : (
                    events.map(event => (
                      <div key={event.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            {event.type === 'nuclear' && <Bomb className="h-3 w-3 text-red-500" />}
                            {event.type === 'war' && <Sword className="h-3 w-3 text-orange-500" />}
                            {event.type === 'military' && <Shield className="h-3 w-3 text-blue-500" />}
                            {event.type === 'diplomatic' && <Handshake className="h-3 w-3 text-green-500" />}
                            {event.type === 'economic' && <Coins className="h-3 w-3 text-yellow-500" />}
                            {event.type === 'crisis' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                            {event.title}
                          </h4>
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
                    <span className="text-sm">Military Dominance</span>
                    <span className="text-sm font-mono">{selectedNation?.military || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nuclear Arsenal</span>
                    <span className="text-sm font-mono">{selectedNation?.nuclearWeapons || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Global Stability</span>
                    <span className="text-sm font-mono">{100 - globalTension}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Turns Remaining</span>
                    <span className="text-sm font-mono">{Math.max(0, 15 - turn)}</span>
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
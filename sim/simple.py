import math
from random import randrange

class Vec3:
	def __init__(self,X=0.0,Y=0.0,Z=0.0):
		self.x = X
		self.y = Y
		self.z = Z

	def set(self,l):
		self.x = l[0]
		self.y = l[1]
		self.z = l[2]

	def __add__(self,other):
		return Vec3(self.x+other.x, self.y+other.y, self.z+other.z)

	def __neg__(self):
		return Vec3(-self.x, -self.y, -self.z)
	
	def mag(self):
		return math.sqrt( self.x**2 +self.y**2 +self.z**2)

	def scale(self,dt):
		return Vec3( dt * self.x, dt * self.y, dt * self.z)
	
	def dot(self,other):
		return (self.x*other.x + self.y*other.y + self.z*other.z)

	def __repr__(self):
		return '{ "x":'+str(self.x)+',"y":'+str(self.y)+',"z":'+str(self.z)+' }'
	
	def normalize(self):
		m = self.mag()
		return Vec3( self.x / m , self.y / m, self.z /m);



class SpaceObject:
	def __init__(self):
		self.pos = Vec3()
		self.vel = Vec3()
		self.acc = Vec3()
		
	def update(self, dt): 
		self.vel += self.acc.scale(dt)
		self.pos += self.vel.scale(dt)

	def __repr__(self):
		return '{ "SpaceObject":{ "pos":'+str(self.pos)+',"vel":'+str(self.vel)+',"acc":'+str(self.acc)+'}}'


class Ship(SpaceObject):
	def __init__(self):
		SpaceObject.__init__(self)

		self.id = 0
		self.player = 'none'

		self.look = Vec3()
		self.maxAcc   = 0.03
		self.maxSpeed = 1.0
	
	def update(self,dt):
		if self.look.mag() != 0.0:
			b = self.look.normalize()
			a1 = b.scale(self.vel.dot(b))
			a2 = self.vel + (-a1)
			self.acc = (b + a2.scale(-1.0)).scale(self.maxAcc)
		
		if self.vel.mag() >= self.maxSpeed:
			self.vel = self.vel.scale( self.maxSpeed / self.vel.mag() )

		SpaceObject.update(self,dt)
	
	def __repr__(self):
		return '{ "Ship":{ "id":'+str(self.id)+',"player":"'+self.player+'","Base":'+SpaceObject.__repr__(self)+'}}'


	


class ShipSpawner:
	def __init__(self, Player='none'):
		self.player = Player
		self.nextID = 0
		self.pos = Vec3()
		self.spawnRadius = 20
	
	def spawn(self):
		s = Ship()
		s.player = self.player
		
		s.id = self.nextID
		self.nextID += 1

		s.pos = self.pos + Vec3( randrange(self.spawnRadius),randrange(self.spawnRadius),randrange(self.spawnRadius))
		
		return s
	

base = ShipSpawner('patrick')
base.pos.set([100,0,0])
s1 = base.spawn()
s2 = base.spawn()

simSteps = 2500

print '['
for i in range(simSteps):
	s1.update(1)
	s2.update(1)

	if i == 950:
		s1.look.set([0,0,1])
		s2.look.set([-1,-1,-1])
	
	print '{ "s1":'+str(s1)+',"s2":'+str(s2)+'}'
	if i != (simSteps-1):
		print ','

print ']'


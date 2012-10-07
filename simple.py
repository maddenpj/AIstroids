import math


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



class Object:
	def __init__(self):
		self.pos = Vec3()
		self.vel = Vec3()
		self.acc = Vec3()

		self.look = Vec3()
		self.maxAcc   = 0.03
		self.maxSpeed = 1.0


	def update(self, dt): 
		
		if self.look.mag() != 0.0:
			b = self.look.normalize()
			a1 = b.scale(self.vel.dot(b))
			a2 = self.vel + (-a1)
			self.acc = (b + a2.scale(-1.0)).scale(self.maxAcc)
		
		if self.vel.mag() >= self.maxSpeed:
			self.vel = self.vel.scale( self.maxSpeed / self.vel.mag() )

		self.vel += self.acc.scale(dt)
		self.pos += self.vel.scale(dt)

	def __repr__(self):
		return '{ "pos":'+str(self.pos)+',"vel":'+str(self.vel)+',"acc":'+str(self.acc)+',"look":'+str(self.look)+'}'

	




o = Object()
o.pos.set([200,0,0])
o.vel.set([-1,1,-1])
#o.acc.set([-0.1,0,0])

simSteps = 2500

print '['
for i in range(simSteps):
	o.update(1)

	#d = ( - o.pos.normalize()).scale(0.1);
	#o.acc = d

	if i == 650:
		o.look.set([0,0,1])
	
	if i != (simSteps-1):
		print o,','
	else:
		print o
print ']'


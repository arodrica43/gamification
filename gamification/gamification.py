"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblockutils.studio_editable import StudioEditableXBlockMixin
from xblock.fields import Integer, Scope, String
from django.contrib.auth.models import User
from xmodule.modulestore.django import modulestore
from xmodule.tabs import CourseTab
from django.conf import settings

class GamificationXBlock(StudioEditableXBlockMixin, XBlock):
	"""
	GamificationXBlock is designed and developed in order to use the Gamification-App web-app. 
	Thus, the code of the repository works as a client-side application for the Gamification Module, which is integrable in OpenedX frameworks.
	With this XBlock you can embed gamification mechanics into your course, forgetting about gamified data management. This is a project from Barcelona University, 
	namely NanoMOOC UB project, so for any use of it, contact with nanomoocsub@gmail.com
	"""

	display_name = String(
		display_name= ("Title (Display name)"),
		help=("Title to display"),
		default=("Gamification XBlock"),
		scope=Scope.settings
	)

	gmechanic_size = String(  # Only instantiate widgets
		display_name="Gamification Mechanic Format",
		default="Widget", 
		scope=Scope.settings,
		help="Gamified Mechanic Format selection (If Id = 0, this field is omitted)",
		values=["Widget","Full"]
	)

	gmechanic_type = String(  # Only instantiate widgets
		display_name="Gamification Mechanic Type",
		default="Adaptative", 
		scope=Scope.settings,
		help="Gamified Mechanic Selection by Type (If Id = 0, this field is omitted)",
		values=["Adaptative", "Badge", "Challenge", "DevelopmentTool", "EasterEgg", "Gift", "GiftOpener", "KnowledgeShare", "Level", "Lottery", "Point", "SocialNetwork", "SocialStatus", "Unlockable", "Leaderboard"]
	)

	gmechanic_id = Integer(
		display_name="Gamification Mechanic Id",
		default=0, 
		scope=Scope.settings,
		help="Gamified Mechanic Selection by Id (If Id = 0, the mechanic is selected by its Type and)",
	)

	adaptative_mode = String(  # Only instantiate widgets
		display_name="Adaptative Gamification Mode",
		default="Static", 
		scope=Scope.settings,
		help="If Mode = Dynamic, when the user refreshes the page a new widget is generated",
		values=["Static","Dynamic"]
	)

	adaptative_id = Integer(
		display_name="Gamification Mechanic Id",
		default=0, 
		scope=Scope.user_state,
		help="If Id = 0, the mechanic is selected by its Type and",
	)

	editable_fields = ('display_name','gmechanic_type', 'gmechanic_id', 'adaptative_mode')

	def resource_string(self, path):
		"""Handy helper for getting resources from our kit."""
		data = pkg_resources.resource_string(__name__, path)
		return data.decode("utf8")

	def get_source(self):
		pivot = self
		done = False
		k = 0
		while not done:
			try:
				k += 1
				pivot = self.runtime.get_block(pivot.parent)
			except:
				done = True
		return pivot

	def get_leafs(self, source):
		leafs = []
		for x in source.get_children():
			try:
				subchilds = x.get_children()
			except:
				subchilds = None
			if subchilds:
				leafs += self.get_leafs(x)
			else:
				leafs += [x]
		return leafs



	def student_view(self, context=None):
		try:
			html =  self.resource_string("static/html/gamification.html")
			frag = Fragment(html.format(self=self))
			frag.add_css(self.resource_string("static/css/gamification.css"))
			frag.add_javascript(self.resource_string("static/js/src/gamification.js"))
			frag.initialize_js('GamificationXBlock')
			#lock.release()
			return frag
		except Exception as e:
			#lock.release()
			raise e

	@XBlock.json_handler
	def set_xblock_content(self, data, suffix=''):
		user_id = self.xmodule_runtime.user_id
		unit_id = str(self.runtime.get_block(self.parent).scope_ids.usage_id)
		v1 = None
		v2 = None
		e1 = None
		e2 = None
		try:
			source = self.get_source()
			leafs = self.get_leafs(source)
			index = None
			for k in range(len(leafs)):
				if leafs[k].scope_ids.usage_id == self.scope_ids.usage_id:
					index = k
					break
			progress = (1.0 + index)/len(leafs)
			if index > 0:
				previous_type = str(leafs[index - 1].scope_ids.block_type)
				
				try: 
					v1 = leafs[index - 1].get_score()
				except Exception as err:
					e1 = err
				try: 
					v1 = leafs[index - 1].has_submitted_answer()
				except Exception as err:
					e2 = err


		except:
			index = None
			progress = "Err"
		if self.adaptative_mode == "Static":
			if self.adaptative_id == 0:
				self.adaptative_id = data['adaptative_mech_id']
			to_send = self.adaptative_id
		else:
			self.adaptative_id = 0
			to_send = data['adaptative_mech_id']
		score, last_score, n, total_activities = 0, 0, 0, 0
		for i in range(len(leafs)):
			try:
				lf = leafs[i]
				bscore = lf.get_score()
				if lf.has_submitted_answer():
					last_score = (0.0 + bscore[0])/bscore[1]
					score += last_score
					n += 1
				total_activities += 1
			except:
				continue
		activity_progress = 0
		if total_activities > 0:
			activity_progress = (0.0 + n)/total_activities
		if n > 0:
			score = score/n
		#Course tabsp
		store = modulestore()
		#with store.bulk_operations(course_id):
		course_id = self.scope_ids.usage_id.course_key
		course = store.get_course(course_id)
		tab_id = "None"
		for tab in course.tabs:
			try:
				tab_name = tab.get('name')
			except:
				pass
			try:
				if str(tab_name) == "Dashboard":
					try:
						tab_id = str(tab.get('tab_id'))[11:]
						break
					except:
						pass
			except:
				pass
		endpoint = settings.NANOMOOCS.get('ENDPOINT')
		stage = settings.NANOMOOCS.get('STAGE')

		return {
			"username" : User.objects.get(id = user_id).username,
			"mech_id": self.gmechanic_id,
			"mech_type" : self.gmechanic_type, 
			"mech_size": self.gmechanic_size, 
			"adaptative_mode": self.adaptative_mode, 
			"adaptative_mech_id" : to_send,
			"progress" : progress,
			"activity_progress": activity_progress,
			"last_score" : last_score,
			"mean_score" : score,
			"course_id" : str(course_id),
			"tab_id" : tab_id,
			"unit_id" : unit_id,
			"last_activity_type" : previous_type,
			"stage" : stage,
			"endpoint" : endpoint,
			"pipe" : [v1,v2,e1,e2]
			}

	@XBlock.json_handler
	def init_xblock_content(self, data, suffix=''):
		

		user_id = self.xmodule_runtime.user_id
		need_log = 1
		if self.adaptative_mode == "Static":
			if self.adaptative_id != 0:
				need_log = 0
		endpoint = settings.NANOMOOCS.get('ENDPOINT')
		stage = settings.NANOMOOCS.get('STAGE')

		return {
				"user_id" : user_id,
				"username" : User.objects.get(id = user_id).username,
				"need_log" : need_log,
				"course_id" : str(self.scope_ids.usage_id.course_key)
				}		

	@staticmethod
	def workbench_scenarios():
		"""A canned scenario for display in the workbench."""
		return [
			("GamificationXBlock",
			 """<gamification/>
			 """),
			("Multiple GamificationXBlock",
			 """<vertical_demo>
				<gamification/>
				<gamification/>
				<gamification/>
				</vertical_demo>
			 """),
		]
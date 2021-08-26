"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblockutils.studio_editable import StudioEditableXBlockMixin
from xblock.fields import Integer, Scope, String
from django.contrib.auth.models import User

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

	difficulty = String(  # Only instantiate widgets
		display_name="Gamification Mechanic Expertise Level",
		default="easy", 
		scope=Scope.settings,
		help="Determines which mechanics can be selected to display, depending on user experience.",
		values=["easy", "hard"]
	)

	dashboard_url = String(  # Only instantiate widgets
		display_name="Associated Dashboard",
		default="#", 
		scope=Scope.settings,
		help="Link to the gamification dashboard of this course."
	)

	editable_fields = ('display_name','gmechanic_type', 'gmechanic_id', 'adaptative_mode', 'difficulty', 'dashboard_url')

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
		if self.adaptative_mode == "Static":
			if self.adaptative_id == 0:
				self.adaptative_id = data['adaptative_mech_id']
			to_send = self.adaptative_id
		else:
			self.adaptative_id = 0
			to_send = data['adaptative_mech_id']
		return {
				"username" : User.objects.get(id = user_id).username,
				"mech_id": self.gmechanic_id,
				"mech_type" : self.gmechanic_type, 
				"mech_size": self.gmechanic_size, 
				"adaptative_mode": self.adaptative_mode, 
				"adaptative_mech_id" : to_send,
				"difficulty" : self.difficulty,
				"dashboard_url" : self.dashboard_url
				}

	@XBlock.json_handler
	def init_xblock_content(self, data, suffix=''):
		try:
			unit_block = self.runtime.get_block(self.parent)
		except:
			unit_block = "Err"
		try:
			sequence = self.runtime.get_block(unit_block.parent)
			section = self.runtime.get_block(sequence.parent)
			course_key = str(section.get_content_titles())
		except:
			course_key = "Err"
		try:
			sequence = self.runtime.get_block(unit_block.parent)
			section = self.runtime.get_block(sequence.parent)
			course_id = str(section.parent)
		except:
			course_id = "Err"
		try:
			unit_type = "Nothing..."
		except:
			unit_type = "Err"
		try:
			source = self.get_source()
			unit_children = str(source)
		except:
			unit_children = "Err"

		user_id = self.xmodule_runtime.user_id
		need_log = 1
		if self.adaptative_mode == "Static":
			if self.adaptative_id != 0:
				need_log = 0

		return {
				"difficulty": self.difficulty,
				"user_id" : user_id,
				"username" : User.objects.get(id = user_id).username,
				"need_log" : need_log,
				"course_key" : course_key,
				"course_id" : course_id,
				"unit_type" : unit_type,
				"children" : unit_children
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
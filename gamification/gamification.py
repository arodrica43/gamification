"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblockutils.studio_editable import StudioEditableXBlockMixin
from xblockutils.settings import XBlockWithSettingsMixin
from xblock.fields import Integer, Scope, String, Boolean
import threading
lock = threading.Lock()

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
        help="Adaptative Gamified Mechanic Mode selection",
        values=["Static","Dynamic"]
    )

    adaptative_id = Integer(
        display_name="Gamification Mechanic Id",
        default=0, 
        scope=Scope.user_state,
        help="Gamified Mechanic Selection by Id (If Id = 0, the mechanic is selected by its Type and)",
    )

    editable_fields = ('display_name', 'gmechanic_size','gmechanic_type', 'gmechanic_id', 'adaptative_mode')

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def student_view(self, context=None):
        """
        The main view of the GamificationXBlock, shown to students
        when viewing courses, and to teachers when designing (by default).
        """
        #lock.acquire()
        try:
        	html =  self.resource_string("static/html/gamification.html")
        	frag = Fragment(html.format(self=self))
        	frag.add_css(self.resource_string("static/css/gamification.css"))
        	if self.gmechanic_id == 0:
        		if self.gmechanic_type == "Adaptative" and self.gmechanic_size == "Widget":
        			if self.adaptative_mode == "Static":
        				js = self.resource_string("static/js/src/static_adaptative_widget.js")
        			else:
        				js = self.resource_string("static/js/src/dynamic_adaptative_widget.js")
        		else:
        			js = self.resource_string("static/js/src/plain_gmechanic.js")
        	else:
        		js = self.resource_string("static/js/src/gmechanic_by_id.js")
        	frag.add_javascript(js)
        	frag.initialize_js('GamificationXBlock')
        	#lock.release()
        	return frag
        except Exception as e:
            #lock.release()
            raise e

    @XBlock.json_handler
    def set_adaptative_id(self, data, suffix=''):
    	if self.adaptative_mode == "Static":
    		if self.adaptative_id == 0:
    			self.adaptative_id = data['index']
    	else:
    		self.adaptative_id = 0
    	return {"mech_id" : self.adaptative_id}

    @XBlock.json_handler
    def get_gmechanic_id(self,data, suffix=''):
    	return {"mech_id" : self.gmechanic_id}

    @XBlock.json_handler
    def get_plain_gmechanic_data(self,data, suffix=''):
    	return {"mech_type" : self.gmechanic_type, "mech_size": self.gmechanic_size}

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
                <gamification/>
                <gamification/>
                <gamification/>
                </vertical_demo>
             """),
        ]

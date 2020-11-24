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
    TO-DO: document what your XBlock does.
    """

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
     # Settings
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

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the GamificationXBlock, shown to students
        when viewing courses.
        """
        lock.acquire()
        try:
            if self.gmechanic_id == 0:
                if self.gmechanic_type == "Adaptative" and self.gmechanic_size == "Widget":
                	if self.adaptative_mode == "Static":
	                	html = self.resource_string("static/html/adaptative_gamification_widget.html")
	                	js = self.resource_string("static/js/src/adaptative_widget.js")
	                else:
	                    html = self.resource_string("static/html/adaptative_gamification_dynamic_widget.html")
	                    js = self.resource_string("static/js/src/gamification.js")
                else:
                    html = self.resource_string("static/html/base_gamification.html")
                    js = self.resource_string("static/js/src/gamification.js")
            else:
                html = self.resource_string("static/html/gamification_by_id.html")
                js = self.resource_string("static/js/src/gamification.js")
            
            frag = Fragment(html.format(self=self))
            frag.add_css(self.resource_string("static/css/gamification.css"))
            frag.add_javascript(js)
            frag.initialize_js('GamificationXBlock')
            lock.release()
            return frag
        except Exception as e:
            lock.release()
            raise e

    @XBlock.json_handler
    def set_adaptative_id(self, data, suffix=''):
    	if self.adaptative_mode == "Static":
    		if self.adaptative_id == 0:
    			self.adaptative_id = data['index']
    	else:
    		self.adaptative_id = 0
    	return {"mech_id" : self.adaptative_id}

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def get_xblock_data(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        # Just to show data coming in...
        #assert data['hello'] == 'world'
        #xblock_id = self.scope_ids.def_id

        return {"data": 0}

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
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

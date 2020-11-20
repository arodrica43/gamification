"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblockutils.studio_editable import StudioEditableXBlockMixin
from xblockutils.settings import XBlockWithSettingsMixin
from xblock.fields import Integer, Scope, String
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
        display_name="Gamification Mechanic Size",
        default="Widget", 
        scope=Scope.settings,
        help="Gamified Mechanic Size modality Selection (If Id = 0, this field is omitted)",
        values=["Widget","Full"]
    )

    gmechanic_type = String(  # Only instantiate widgets
        display_name="Gamification Mechanic Type",
        default="Leaderboard", 
        scope=Scope.settings,
        help="Gamified Mechanic Selection by Type (If Id = 0, this field is omitted)",
        values=["Adaptative", "Badge", "Challenge", "DevelopmentTool", "EasterEgg", "Gift", "GiftOpener", "KnowledgeShare", "Level", "Lottery", "Point", "SocialNetwork", "SocialStatus", "Unlockable", "Leaderboard"]
    )

    gmechanic_id = Integer(
        display_name="Gamification Mechanic Id",
        default=180, 
        scope=Scope.settings,
        help="Gamified Mechanic Selection by Id (If Id = 0, the mechanic is selected by its Size and Type)",
    )

    editable_fields = ('display_name', 'gmechanic_size','gmechanic_type', 'gmechanic_id')

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
            html = self.resource_string("static/html/gamification.html")
            frag = Fragment(html.format(self=self))
            frag.add_css(self.resource_string("static/css/gamification.css"))
            frag.add_javascript(self.resource_string("static/js/src/gamification.js"))
            frag.initialize_js('GamificationXBlock')
            lock.release()
            return frag
        except:
            lock.release()
            raise Exception("Error loading student view")

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

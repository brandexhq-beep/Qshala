import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Define Palette
C_PRIMARY = colors.HexColor("#0F172A")    # Deep Slate
C_SECONDARY = colors.HexColor("#1E293B")  # Charcoal
C_YELLOW = colors.HexColor("#FDB913")     # QShala Yellow
C_BLUE = colors.HexColor("#30B2E7")       # QShala Sky Blue
C_GREEN = colors.HexColor("#75B543")      # QShala Green
C_PURPLE = colors.HexColor("#9333EA")     # QShala Purple
C_TEXT = colors.HexColor("#334155")       # Body text
C_MUTED = colors.HexColor("#64748B")      # Muted text
C_BG_LIGHT = colors.HexColor("#F8FAFC")   # Light gray / slate
C_BORDER = colors.HexColor("#E2E8F0")     # Light border
C_ACCENT_BG = colors.HexColor("#FEF3C7")  # Warm yellow tint
C_BLUE_BG = colors.HexColor("#E0F2FE")    # Light blue tint

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(C_MUTED)
            self.drawString(54, letter[1] - 36, "QShala Content Studio • Sanity CMS Editor's Field Guide")
            self.drawRightString(letter[0] - 54, letter[1] - 36, "Internal Editorial & Operations Guide")
            self.setStrokeColor(C_BORDER)
            self.setLineWidth(0.75)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)
        
        # Footer (All pages)
        self.setStrokeColor(C_BORDER)
        self.setLineWidth(0.75)
        self.line(54, 45, letter[0] - 54, 45)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(C_MUTED)
        self.drawString(54, 32, "QShala — Questions • Quriosity • Quests • www.qshala.com")
        self.drawRightString(letter[0] - 54, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_pdf(filename="public/docs/QShala_Sanity_CMS_Editors_Guide.pdf"):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Typographic Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=C_PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=C_BLUE,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=C_PRIMARY,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=C_SECONDARY,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=C_TEXT,
        spaceAfter=5
    )

    body_bold = ParagraphStyle(
        'BodyDarkBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=C_PRIMARY
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=C_TEXT,
        leftIndent=12,
        spaceAfter=3
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.white
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=C_PRIMARY
    )

    table_cell_text = ParagraphStyle(
        'TableCellText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=C_TEXT
    )

    callout_text = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#78350F")
    )

    callout_bold = ParagraphStyle(
        'CalloutBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#78350F")
    )

    story = []

    # ================= PAGE 1 =================
    # Title Banner Block
    story.append(Paragraph("QShala Content Studio", title_style))
    story.append(Paragraph("Where to Find What: The Complete Content Editor's Field Guide", subtitle_style))
    
    intro_p = Paragraph(
        "<b>Welcome to the QShala Content Operations Guide!</b> This field manual is designed so any team member "
        "can confidently edit, publish, and manage all content on <b>www.qshala.com</b> without needing technical assistance. "
        "Every change in Sanity Studio maps directly to pages on the live website.",
        body_style
    )
    story.append(intro_p)
    story.append(Spacer(1, 8))

    # Quick Access Banner
    access_data = [
        [
            Paragraph("<b>Studio Web Address:</b>", callout_bold),
            Paragraph("Open your browser and navigate to <b>https://qshala.sanity.studio</b> (or manage.sanity.io)", callout_text)
        ],
        [
            Paragraph("<b>Login Method:</b>", callout_bold),
            Paragraph("Sign in using your authorized work Google or email account.", callout_text)
        ]
    ]
    t_access = Table(access_data, colWidths=[120, 384])
    t_access.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_ACCENT_BG),
        ('BOX', (0,0), (-1,-1), 1.5, C_YELLOW),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#FDE68A")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_access)
    story.append(Spacer(1, 12))

    # Section 1: Master Cheat Sheet Table
    story.append(Paragraph("1. Master Content Map: \"Where Do I Edit What?\"", h1_style))
    story.append(Paragraph("Use this quick lookup table to find the exact Sanity folder for any part of the website:", body_style))
    story.append(Spacer(1, 4))

    map_data = [
        [
            Paragraph("Website Section / Feature", table_header_style),
            Paragraph("Live Website URL", table_header_style),
            Paragraph("Sanity Sidebar Document", table_header_style),
            Paragraph("Key Editable Fields", table_header_style)
        ],
        [
            Paragraph("<b>Hero Headlines & Tagline</b>", table_cell_bold),
            Paragraph("Homepage (Top fold)", table_cell_text),
            Paragraph("<b>Homepage Content</b>", table_cell_bold),
            Paragraph("Hero badge, animated typewriter words, intro text, CTA button", table_cell_text)
        ],
        [
            Paragraph("<b>Upcoming Events Carousel</b>", table_cell_bold),
            Paragraph("Homepage (/ #events)", table_cell_text),
            Paragraph("<b>Events & Quests</b>", table_cell_bold),
            Paragraph("Title, date, venue, category badge, registration/private button", table_cell_text)
        ],
        [
            Paragraph("<b>The QShala Effect (Moments)</b>", table_cell_bold),
            Paragraph("Homepage (/ #effect)", table_cell_text),
            Paragraph("<b>Homepage Content</b><br/>(The QShala Effect tab)", table_cell_bold),
            Paragraph("Curated event photos, audience category, custom links, impact stats", table_cell_text)
        ],
        [
            Paragraph("<b>Daily Quiz Game</b>", table_cell_bold),
            Paragraph("Homepage (/ #game)", table_cell_text),
            Paragraph("<b>Homepage Content</b><br/>(Daily Game tab)", table_cell_bold),
            Paragraph("Daily question, answer options, explanation, celebration mascot", table_cell_text)
        ],
        [
            Paragraph("<b>Case Studies & Impact</b>", table_cell_bold),
            Paragraph("/case-studies<br/>/case-studies/[slug]", table_cell_text),
            Paragraph("<b>Case Studies & Impact</b>", table_cell_bold),
            Paragraph("Title, client name, hero image, narrative text, photo gallery, display order", table_cell_text)
        ],
        [
            Paragraph("<b>Blog Stories & Articles</b>", table_cell_bold),
            Paragraph("/blog<br/>/blog/[slug]", table_cell_text),
            Paragraph("<b>Stories & Blog Posts</b>", table_cell_bold),
            Paragraph("Article title, cover photo, category tag, read time, full rich text story", table_cell_text)
        ],
        [
            Paragraph("<b>Display Case Study in Blog Feed</b>", table_cell_bold),
            Paragraph("/blog & Homepage", table_cell_text),
            Paragraph("<b>Case Studies & Impact</b>", table_cell_bold),
            Paragraph("Check the <i>\"Display in Blog & Event Stories Feed\"</i> toggle", table_cell_text)
        ],
        [
            Paragraph("<b>Audience Landing Pages</b>", table_cell_bold),
            Paragraph("/schools, /companies<br/>/colleges, /communities", table_cell_text),
            Paragraph("<b>Service Pages</b>", table_cell_bold),
            Paragraph("Hero titles, offering cards, flagship quiz highlights, process steps", table_cell_text)
        ],
        [
            Paragraph("<b>About Us & Founders</b>", table_cell_bold),
            Paragraph("/about", table_cell_text),
            Paragraph("<b>About Page</b> +<br/><b>Team Members</b>", table_cell_bold),
            Paragraph("Founders story, key impact numbers, team photos, bios & LinkedIn links", table_cell_text)
        ],
        [
            Paragraph("<b>Advisory Board</b>", table_cell_bold),
            Paragraph("/about#advisors", table_cell_text),
            Paragraph("<b>Advisory Board</b>", table_cell_bold),
            Paragraph("Advisor name, organization (e.g. Zerodha), photo, quote", table_cell_text)
        ],
        [
            Paragraph("<b>Client & School Marquee Logos</b>", table_cell_bold),
            Paragraph("Homepage & Services", table_cell_text),
            Paragraph("<b>Partners & Logos</b>", table_cell_bold),
            Paragraph("Company / School name, transparent PNG logo upload", table_cell_text)
        ],
        [
            Paragraph("<b>FAQs (Help Center)</b>", table_cell_bold),
            Paragraph("/faq & Homepage", table_cell_text),
            Paragraph("<b>FAQs</b>", table_cell_bold),
            Paragraph("Question, answer, category, show on homepage toggle", table_cell_text)
        ],
        [
            Paragraph("<b>Navigation Bar & Footer</b>", table_cell_bold),
            Paragraph("Every page", table_cell_text),
            Paragraph("<b>Navigation</b> &<br/><b>Footer</b>", table_cell_bold),
            Paragraph("Menu links, primary CTA button, addresses, social media links", table_cell_text)
        ]
    ]

    t_map = Table(map_data, colWidths=[120, 95, 125, 164])
    t_map.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('BOX', (0,0), (-1,-1), 1, C_PRIMARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
    ]))
    story.append(t_map)

    story.append(PageBreak())

    # ================= PAGE 2 =================
    story.append(Paragraph("2. Deep Dive: Managing Core Website Sections", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BORDER, spaceAfter=8))

    # Subsection A: Events & Quests
    story.append(Paragraph("A. Events & Quests (Homepage Carousel)", h2_style))
    story.append(Paragraph(
        "The <b>Events & Quests</b> document controls the interactive cards displayed under <i>\"Upcoming Events\"</i> "
        "on the homepage. Follow these guidelines when creating or updating an event:",
        body_style
    ) )
    
    events_items = [
        "<b>Audience Category:</b> Choose strictly one of: <code>School</code>, <code>Corporate</code>, <code>College</code>, or <code>Community</code>. The card badge and color are automatically styled.",
        "<b>Event Date & Venue:</b> Enter the display date (e.g. <code>Nov 11, 2026</code>) and Location (e.g. <code>Bengaluru</code> or <code>Online Hub</code>).",
        "<b>Button Type Settings (Crucial for Corporate / Private Events):</b>",
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Register Now:</b> Use for public events with external registration forms or booking links.",
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Learn More:</b> For general informational events linking to service pages.",
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Host Similar Event:</b> Directly prompts visitors to book a similar quiz for their own team.",
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>No Button / Private Event:</b> Specifically designed for closed corporate sessions (like the <i>Lightspeed India Quiz</i>). Renders a clean, full-width inquiry button: <code>Host for Your Team →</code> linking directly to the Corporate inquiry form (clean design without redundant tags).",
        "<b>Display Order:</b> Use numbers (0, 1, 2) to control which event appears first on the left of the slider."
    ]
    for item in events_items:
        story.append(Paragraph(f"• {item}", bullet_style))
    story.append(Spacer(1, 8))

    # Subsection B: The QShala Effect
    story.append(Paragraph("B. The QShala Effect (Live Moments Gallery)", h2_style))
    story.append(Paragraph(
        "Located under <b>Homepage Content → The QShala Effect</b> tab. This section showcases authentic photos of real "
        "QShala sessions across classrooms, auditoriums, and corporate offsites:",
        body_style
    ))
    effect_items = [
        "<b>Section Toggle:</b> Turn the entire section on or off using the <i>\"Show The QShala Effect section\"</i> checkbox.",
        "<b>Adding Moments:</b> Click <b>\"Add item\"</b> under <i>Curated Moments & Gallery Photos</i>:",
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Title / Caption:</b> Describe the moment (e.g. <i>\"Cross-functional teams cheering during live trivia\"</i>).",
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Audience Category:</b> Select <code>Schools</code>, <code>Corporate</code>, <code>Colleges</code>, or <code>Community</code>. Filter tabs on the homepage update automatically!",
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Photo Upload:</b> Upload an event photo. Use the <b>Hotspot</b> tool (blue focal circle) to center on people's faces.",
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Click Destination:</b> (Optional) Direct visitors to a case study (e.g. <code>/case-studies/safety-quest...</code>) or service page (<code>/companies</code>).",
        "<b>Impact Numbers Strip:</b> Add highlight metrics under <i>Impact Highlights</i> (e.g. <code>250+</code> / <i>\"Partner Schools\"</i> or <code>80+</code> / <i>\"Top Corporates\"</i>)."
    ]
    for item in effect_items:
        story.append(Paragraph(f"• {item}", bullet_style))
    story.append(Spacer(1, 8))

    # Subsection C: Case Studies
    story.append(Paragraph("C. Case Studies & Impact Stories", h2_style))
    story.append(Paragraph(
        "Found in the <b>Case Studies & Impact</b> folder. Case studies are QShala's primary social proof and credibility builder:",
        body_style
    ))
    cs_items = [
        "<b>Client Name & Type:</b> Enter the partner name (e.g. <i>Zerodha</i>, <i>DPS</i>) and audience type.",
        "<b>Key Metrics:</b> Add 2 to 4 tangible results (e.g. <i>\"10,000+ Students Engaged\"</i>, <i>\"94% Retention\"</i>).",
        "<b>Full Story Narrative (Editorial Formatting):</b> Type or paste your story into the rich text field. Use <b>Heading 2</b> for main sections, <b>Heading 3</b> for subtopics, and bullet lists for highlights. Formatting is automatically styled with clean editorial typography on the website.",
        "<b>Batch Photo Drag-and-Drop:</b> Scroll to the <b>Photo Gallery</b> field. Select 10 to 30 photos on your computer and <b>drag them directly into the gallery box all at once</b>. They upload in parallel!",
        "<b>\"Display in Blog & Event Stories Feed\" Toggle:</b> Check this box if you want the case study to appear on both <code>/case-studies</code> AND the <code>/blog</code> feed simultaneously.",
        "<b>Display Order:</b> Assign <code>0</code> for your top featured flagship case study, <code>1</code> for second, etc."
    ]
    for item in cs_items:
        story.append(Paragraph(f"• {item}", bullet_style))

    story.append(PageBreak())

    # ================= PAGE 3 =================
    story.append(Paragraph("3. Pages, People & Brand Assets", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BORDER, spaceAfter=8))

    # Subsection D: Service Pages
    story.append(Paragraph("A. Audience Service Landing Pages (/schools, /companies, /colleges, etc.)", h2_style))
    story.append(Paragraph(
        "Open the <b>Service Pages</b> folder. You will find 5 dedicated landing pages:",
        body_style
    ))
    service_table_data = [
        [
            Paragraph("Service Page Document", table_header_style),
            Paragraph("Target Audience & URL", table_header_style),
            Paragraph("Editable Content Elements", table_header_style)
        ],
        [
            Paragraph("<b>Quriosity in Your School</b>", table_cell_bold),
            Paragraph("Schools (/schools)", table_cell_text),
            Paragraph("Curriculum pillars, NEP 2020 alignment, Quiz Club offerings, teacher testimonials", table_cell_text)
        ],
        [
            Paragraph("<b>Quriosity at Work</b>", table_cell_bold),
            Paragraph("Corporates (/companies)", table_cell_text),
            Paragraph("Team engagement formats, offsite trivia, brand custom quizzes, corporate client logos", table_cell_text)
        ],
        [
            Paragraph("<b>Quriosity on Campus</b>", table_cell_bold),
            Paragraph("Colleges (/colleges)", table_cell_text),
            Paragraph("College fest championships, inter-collegiate tournaments, campus ambassador program", table_cell_text)
        ],
        [
            Paragraph("<b>Quriosity for Your Crowd</b>", table_cell_bold),
            Paragraph("Communities (/communities)", table_cell_text),
            Paragraph("Family quiz nights, housing society fests, community trivia championships", table_cell_text)
        ],
        [
            Paragraph("<b>Let's Build Something New</b>", table_cell_bold),
            Paragraph("Custom Projects (/custom)", table_cell_text),
            Paragraph("Custom IP creation, state-wide literacy campaigns, museum & educational installations", table_cell_text)
        ]
    ]
    t_serv = Table(service_table_data, colWidths=[140, 120, 244])
    t_serv.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_SECONDARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('BOX', (0,0), (-1,-1), 1, C_SECONDARY),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, C_BG_LIGHT]),
    ]))
    story.append(t_serv)
    story.append(Spacer(1, 10))

    # Subsection E: Team & Advisory Board
    story.append(Paragraph("B. Team Members & Advisory Board", h2_style))
    story.append(Paragraph(
        "QShala's credibility stems from its people. Manage all team profiles across two folders:",
        body_style
    ))
    story.append(Paragraph(
        "• <b>Team Members (Curiosity Crew & Co-Founders):</b> Add or edit team profiles. Co-founders (Sachin Ravi & Raghav Chakravarthy) "
        "have the <i>\"Co-Founder\"</i> role checkbox checked. Upload a clean square photo, job title, and LinkedIn profile link.<br/>"
        "• <b>Advisory Board:</b> Manage advisors (e.g. Nithin Kamath, Chetan Vinchhi, Kalyan Banerjee). Enter their primary organization "
        "and advice quote.<br/>"
        "• <b>Ordering:</b> Use the <code>Order</code> field to prioritize who appears first in the grid.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Subsection F: FAQs, Testimonials & Partners
    story.append(Paragraph("C. FAQs, Client Logos & Testimonials", h2_style))
    story.append(Paragraph(
        "• <b>FAQs:</b> Add questions and answers. Select category (General, Schools, Companies). Check <i>\"Show on Homepage\"</i> if you want it featured in the homepage FAQ accordions.<br/>"
        "• <b>Partners & Logos:</b> Upload transparent PNG logos for schools and companies (e.g. Google, Amazon, Zerodha, DPS). They dynamically scroll across the client marquee.<br/>"
        "• <b>Testimonials:</b> Add quotes from school principals, parents, and corporate HR leaders with their name, designation, and photo.",
        body_style
    ))

    story.append(PageBreak())

    # ================= PAGE 4 =================
    story.append(Paragraph("4. The 4 Golden Rules for Content Editors", h1_style))
    story.append(Paragraph("Follow these 4 essential rules to keep the website fast, reliable, and error-free:", body_style))
    story.append(HRFlowable(width="100%", thickness=1, color=C_BORDER, spaceAfter=10))

    # Rule 1
    r1_data = [
        [
            Paragraph("<b>RULE 1: Understand \"Draft\" vs. \"Published\" (Auto-Save is Safe)</b>", table_header_style)
        ],
        [
            Paragraph(
                "• <b>Sanity auto-saves every keystroke:</b> As you type, add images, or edit words, Sanity saves your work into a <i>Draft</i> document.<br/>"
                "• <b>Drafts are 100% invisible to visitors:</b> The live website only queries <i>Published</i> documents. An unfinished draft will never be seen by public users.<br/>"
                "• <b>Do not click 'Publish' until your piece is finished:</b> Feel free to leave articles half-written overnight in draft state. It will be waiting for you when you return.",
                body_style
            )
        ]
    ]
    t_r1 = Table(r1_data, colWidths=[504])
    t_r1.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0284C7")),
        ('BACKGROUND', (0,1), (-1,1), C_BLUE_BG),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#0284C7")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_r1)
    story.append(Spacer(1, 10))

    # Rule 2
    r2_data = [
        [
            Paragraph("<b>RULE 2: Batch Publishing (Preserving Vercel Build Limits)</b>", table_header_style)
        ],
        [
            Paragraph(
                "• <b>How publishing works:</b> When you hit the green <b>Publish</b> button, a webhook signals our host (Vercel) to build and deploy the updated static pages.<br/>"
                "• <b>The Free Tier Limit:</b> Vercel permits up to 100 builds per day. If an editor publishes after every single typo fix, it burns unnecessary build cycles.<br/>"
                "• <b>The Golden Habit:</b> Complete all your edits in Draft mode first. If you are uploading 5 case studies or 10 events, finish editing all 5 as drafts, and then publish them one after another in one session. Vercel automatically merges overlapping builds into a single deployment!",
                body_style
            )
        ]
    ]
    t_r2 = Table(r2_data, colWidths=[504])
    t_r2.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#D97706")),
        ('BACKGROUND', (0,1), (-1,1), C_ACCENT_BG),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#D97706")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_r2)
    story.append(Spacer(1, 10))

    # Rule 3
    r3_data = [
        [
            Paragraph("<b>RULE 3: Image Sizing & The Blue Hotspot Tool</b>", table_header_style)
        ],
        [
            Paragraph(
                "• <b>The Focal Hotspot (Blue Circle):</b> Whenever you upload an image in Sanity, click the image to open the crop tool. Drag the blue circle directly over the most important subject (e.g. people's faces). This guarantees that on mobile phones and tablets, the face is never accidentally cropped out.<br/>"
                "• <b>Format & Sizes:</b> Upload clear JPEG, PNG, or WebP images. While Sanity automatically compresses images to modern WebP for users, try to keep source photos under <b>5 MB</b> for fast uploads.<br/>"
                "• <b>Batch Gallery Uploads:</b> In Case Studies & Stories, drag-and-drop multiple images into the Gallery box all at once.",
                body_style
            )
        ]
    ]
    t_r3 = Table(r3_data, colWidths=[504])
    t_r3.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#059669")),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#ECFDF5")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#059669")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_r3)
    story.append(Spacer(1, 10))

    # Rule 4
    r4_data = [
        [
            Paragraph("<b>RULE 4: Display Order Logic (0, 1, 2)</b>", table_header_style)
        ],
        [
            Paragraph(
                "• <b>Lower numbers appear first:</b> An item with order <code>0</code> will always appear before <code>1</code>, which appears before <code>2</code>.<br/>"
                "• <b>Unset order values:</b> If you leave the order blank (or unset), the website automatically sorts items chronologically by publication date.<br/>"
                "• <b>Reordering tip:</b> If you want a new case study or event to immediately jump to the #1 spot, simply set its Order to <code>0</code>.",
                body_style
            )
        ]
    ]
    t_r4 = Table(r4_data, colWidths=[504])
    t_r4.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#7C3AED")),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor("#F5F3FF")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#7C3AED")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_r4)
    story.append(Spacer(1, 14))

    # Final Help Box
    help_box = [
        [
            Paragraph("<b>Need Help or Have Questions?</b>", callout_bold),
            Paragraph("For urgent CMS assistance, new feature requests, or schema changes, reach out to your engineering team or contact QShala Support at <b>hello@qshala.com</b>.", callout_text)
        ]
    ]
    t_help = Table(help_box, colWidths=[150, 354])
    t_help.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, C_SECONDARY),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_help)

    # Build the PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generated successfully at: {filename}")

if __name__ == '__main__':
    build_pdf()

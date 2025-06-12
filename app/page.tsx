'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Github, Linkedin, Mail, ExternalLink, Code2, Palette, Smartphone, Globe, ArrowUp, Download, Send, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AudioPlayer from '@/components/AudioPlayer';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface WavePoint {
  x: number;
  y: number;
  originalY: number;
  angle: number;
  amplitude: number;
  frequency: number;
}

export default function Portfolio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(true);
  const [fps, setFps] = useState(0);
  
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const particlesRef = useRef<Particle[]>([]);
  const wavePointsRef = useRef<WavePoint[]>([]);
  const animationIdRef = useRef<number>();
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

  const skills = [
    { name: 'React/Next.js', level: 95, icon: '⚛️', color: 'from-blue-400 to-cyan-400' },
    { name: 'TypeScript', level: 90, icon: '📘', color: 'from-blue-500 to-indigo-500' },
    { name: 'Node.js', level: 85, icon: '🟢', color: 'from-green-400 to-emerald-400' },
    { name: 'Python', level: 80, icon: '🐍', color: 'from-yellow-400 to-orange-400' },
    { name: 'UI/UX Design', level: 75, icon: '🎨', color: 'from-pink-400 to-purple-400' },
    { name: 'DevOps', level: 70, icon: '⚙️', color: 'from-gray-400 to-slate-400' },
  ];

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, product management, shopping cart, and secure payment processing.',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
      github: '#',
      live: '#'
    },
    {
      title: 'AI Dashboard',
      description: 'Analytics dashboard with machine learning insights and real-time data visualization. Built with Python backend and React frontend with interactive charts.',
      image: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Python', 'React', 'TensorFlow', 'D3.js', 'PostgreSQL'],
      github: '#',
      live: '#'
    },
    {
      title: 'Mobile Weather App',
      description: 'Cross-platform mobile app with weather forecasts and location-based alerts. Features offline support and beautiful weather animations.',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['React Native', 'Firebase', 'Weather API', 'Expo'],
      github: '#',
      live: '#'
    }
  ];

  // Initialize canvas animation
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 70%)`,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100
      });
    }

    // Initialize wave points
    wavePointsRef.current = [];
    const waveResolution = 100;
    for (let i = 0; i <= waveResolution; i++) {
      const x = (canvas.width / waveResolution) * i;
      wavePointsRef.current.push({
        x,
        y: canvas.height / 2,
        originalY: canvas.height / 2,
        angle: (Math.PI * 2 / waveResolution) * i,
        amplitude: Math.random() * 50 + 20,
        frequency: Math.random() * 0.02 + 0.01
      });
    }
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    if (!isAnimationPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life++;

      // Mouse interaction
      const dx = mousePosition.x - particle.x;
      const dy = mousePosition.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += (dx / distance) * force * 0.1;
        particle.vy += (dy / distance) * force * 0.1;
      }

      // Boundary check
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));

      // Reset particle if life exceeded
      if (particle.life > particle.maxLife) {
        particle.life = 0;
        particle.x = Math.random() * canvas.width;
        particle.y = Math.random() * canvas.height;
        particle.vx = (Math.random() - 0.5) * 2;
        particle.vy = (Math.random() - 0.5) * 2;
      }

      // Draw particle
      ctx.save();
      ctx.globalAlpha = particle.opacity * (1 - particle.life / particle.maxLife);
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.shadowBlur = particle.size * 2;
      ctx.shadowColor = particle.color;
      ctx.fill();
      ctx.restore();
    });

    // Update and draw waves
    const time = Date.now() * 0.001;
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 2;

    wavePointsRef.current.forEach((point, index) => {
      point.angle += point.frequency;
      point.y = point.originalY + Math.sin(point.angle + time) * point.amplitude;
    });

    // Draw wave lines
    for (let wave = 0; wave < 3; wave++) {
      ctx.beginPath();
      ctx.moveTo(wavePointsRef.current[0].x, wavePointsRef.current[0].y + wave * 50);
      
      for (let i = 1; i < wavePointsRef.current.length; i++) {
        const point = wavePointsRef.current[i];
        ctx.lineTo(point.x, point.y + wave * 50 + Math.sin(time + wave) * 20);
      }
      
      ctx.stroke();
    }
    ctx.restore();

    // Connect nearby particles
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const p1 = particlesRef.current[i];
        const p2 = particlesRef.current[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // FPS Counter
    fpsCounterRef.current.frames++;
    const now = Date.now();
    if (now - fpsCounterRef.current.lastTime >= 1000) {
      setFps(fpsCounterRef.current.frames);
      fpsCounterRef.current.frames = 0;
      fpsCounterRef.current.lastTime = now;
    }

    animationIdRef.current = requestAnimationFrame(animate);
  }, [isAnimationPlaying, mousePosition]);

  // Initialize and start animation
  useEffect(() => {
    initCanvas();
    animate();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [initCanvas, animate]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: 'hero', ref: heroRef },
        { id: 'about', ref: aboutRef },
        { id: 'skills', ref: skillsRef },
        { id: 'projects', ref: projectsRef },
        { id: 'contact', ref: contactRef }
      ];

      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        if (section.ref.current) {
          const { offsetTop, offsetHeight } = section.ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }

      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const refs = { hero: heroRef, about: aboutRef, skills: skillsRef, projects: projectsRef, contact: contactRef };
    const ref = refs[sectionId as keyof typeof refs];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleAnimation = () => {
    setIsAnimationPlaying(!isAnimationPlaying);
    if (!isAnimationPlaying) {
      animate();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Noise Overlay */}
      <div className="noise-overlay" />
      
      {/* Custom Cursor */}
      <div 
        className="custom-cursor"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      />

      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[2]"
      />

      {/* Audio Player */}
      <AudioPlayer 
        title="The art of listening"
        artist="KOSIKK"
      />

      {/* Controls */}
      <div className="fixed top-5 left-5 z-[100] flex gap-5 items-center">
        <Button
          onClick={toggleAnimation}
          variant="outline"
          size="sm"
          className="bg-white/20 border-white/40 text-white hover:bg-white/30 backdrop-blur-sm"
        >
          {isAnimationPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isAnimationPlaying ? 'PAUSE' : 'PLAY'}
        </Button>
      </div>

      {/* FPS Counter */}
      <div className="fixed top-5 right-5 text-white text-xs bg-black/50 px-2 py-1 rounded z-[100]">
        FPS: {fps}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="flex justify-center">
          <div className="flex space-x-8 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
            {['hero', 'about', 'skills', 'projects', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === section
                    ? 'bg-white text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 z-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-lg opacity-70 mb-4 font-light tracking-wide">Find beauty in the space between sound</p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-tight tracking-tight">
              The art of listening
            </h1>
            <p className="text-lg opacity-70 mb-2 font-light italic">When you learn to see the invisible, you create the impossible</p>
            <p className="text-sm opacity-50 italic">Full Stack Developer & UI/UX Designer</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button 
              onClick={() => scrollToSection('projects')}
              size="lg"
              className="bg-white text-black hover:bg-gray-200 font-medium px-8 py-3"
            >
              View My Work
            </Button>
            <Button 
              onClick={() => scrollToSection('contact')}
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 font-medium px-8 py-3"
            >
              Get In Touch
            </Button>
          </div>

          <div className="mt-16 animate-bounce">
            <ChevronDown className="w-6 h-6 mx-auto opacity-60" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="relative py-32 px-6 z-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-12 tracking-tight">About Me</h2>
          <div className="text-lg leading-relaxed space-y-6 opacity-90">
            <p>
              I'm a passionate full-stack developer with over 5 years of experience crafting digital experiences 
              that blend beautiful design with powerful functionality. My journey began with a curiosity about 
              how things work and evolved into a love for creating solutions that make people's lives easier.
            </p>
            <p>
              I specialize in React, Next.js, and Node.js, but I'm always exploring new technologies and 
              methodologies. When I'm not coding, you'll find me sketching UI concepts, experimenting with 
              new design tools, or contributing to open-source projects.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="relative py-32 px-6 z-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center tracking-tight">Skills & Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <Card key={skill.name} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{skill.icon}</span>
                    <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="text-sm text-white/70">{skill.level}%</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="relative py-32 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center tracking-tight">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 group">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-white/70 mb-4 text-sm leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-white/20 text-white/80 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                    <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="relative py-32 px-6 z-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center tracking-tight">Let's Work Together</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              <p className="text-white/70 mb-8 leading-relaxed">
                I'm always interested in new opportunities and exciting projects. 
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-white/60" />
                  <span>hello@example.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <Linkedin className="w-5 h-5 text-white/60" />
                  <span>linkedin.com/in/example</span>
                </div>
                <div className="flex items-center gap-4">
                  <Github className="w-5 h-5 text-white/60" />
                  <span>github.com/example</span>
                </div>
              </div>
            </div>
            
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div>
                    <Input 
                      placeholder="Your Name" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                    />
                  </div>
                  <div>
                    <Input 
                      type="email" 
                      placeholder="Your Email" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                    />
                  </div>
                  <div>
                    <Textarea 
                      placeholder="Your Message" 
                      rows={5}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                    />
                  </div>
                  <Button className="w-full bg-white text-black hover:bg-gray-200">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Profile Card */}
      <div className="fixed bottom-4 left-4 flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg z-50">
        <img 
          src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=128" 
          alt="Profile" 
          className="w-7 h-7 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-white">Your Name</p>
          <p className="text-xs text-white/60">@yourhandle</p>
        </div>
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="sm"
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 z-50"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
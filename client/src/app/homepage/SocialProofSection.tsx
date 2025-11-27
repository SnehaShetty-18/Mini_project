import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avatarAlt: string;
  quote: string;
  rating: number;
}

interface Partnership {
  id: string;
  name: string;
  logo: string;
  logoAlt: string;
  type: 'municipal' | 'organization' | 'media';
}

interface SocialProofSectionProps {
  className?: string;
}

const SocialProofSection = ({ className = '' }: SocialProofSectionProps) => {
  const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Community Leader',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19dc77a7e-1762274545448.png",
    avatarAlt: 'Professional headshot of Asian woman with shoulder-length black hair smiling warmly',
    quote: 'Civic AI Connect transformed how our neighborhood addresses issues. The AI prioritization helped us get a dangerous intersection fixed in just 3 days instead of months.',
    rating: 5
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Local Business Owner',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_15e45e373-1762274073285.png",
    avatarAlt: 'Professional headshot of Hispanic man with short dark hair and friendly smile in business attire',
    quote: 'The transparency is incredible. I can track every report from submission to resolution. It\'s built real trust between citizens and city officials.',
    rating: 5
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    role: 'Neighborhood Association President',
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: 'Professional headshot of Caucasian woman with blonde hair in professional blazer smiling confidently',
    quote: 'The community engagement features helped us organize 200+ volunteers for park cleanup. This platform doesn\'t just report problems—it builds solutions.',
    rating: 5
  }];


  const partnerships: Partnership[] = [
  {
    id: '1',
    name: 'City of Springfield',
    logo: "https://images.unsplash.com/photo-1562850708-cfa2d4277147",
    logoAlt: 'Springfield city hall building with American flag and official municipal seal',
    type: 'municipal'
  },
  {
    id: '2',
    name: 'Metro Transit Authority',
    logo: "https://images.unsplash.com/photo-1500844861738-30de46b860f9",
    logoAlt: 'Modern public transit bus with Metro Transit Authority branding and logo',
    type: 'organization'
  },
  {
    id: '3',
    name: 'Smart Cities Initiative',
    logo: "https://images.unsplash.com/photo-1640184713839-9b87bde3cba5",
    logoAlt: 'Digital smart city technology display showing connected urban infrastructure',
    type: 'organization'
  },
  {
    id: '4',
    name: 'Local News Network',
    logo: "https://images.unsplash.com/photo-1535371166070-3797d6494fea",
    logoAlt: 'Professional news studio with broadcasting equipment and network branding',
    type: 'media'
  }];


  const stats = [
  { label: 'Issues Resolved', value: '2,847', icon: 'CheckCircleIcon' },
  { label: 'Citizen Satisfaction', value: '94%', icon: 'HeartIcon' },
  { label: 'Active Communities', value: '156', icon: 'UserGroupIcon' },
  { label: 'Response Time', value: '2.3hrs', icon: 'ClockIcon' }];


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) =>
    <Icon
      key={i}
      name="StarIcon"
      size={16}
      className={i < rating ? 'text-warning' : 'text-border'} />

    );
  };

  return (
    <section className={`py-16 bg-surface ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Trusted by Communities Nationwide
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-12">
            Real results from real communities using AI-powered civic engagement to create positive change.
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) =>
            <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-civic-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name={stat.icon as any} size={32} className="text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            )}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              What Community Leaders Say
            </h3>
            <p className="text-text-secondary">
              Hear from citizens who are making a difference in their neighborhoods
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) =>
            <div key={testimonial.id} className="bg-card rounded-civic-lg p-6 civic-shadow border border-border">
                <div className="flex items-center space-x-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <blockquote className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <AppImage
                    src={testimonial.avatar}
                    alt={testimonial.avatarAlt}
                    className="w-full h-full object-cover" />

                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-text-secondary">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Partnerships */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Trusted Partners
            </h3>
            <p className="text-text-secondary">
              Working with municipal authorities and civic organizations to build stronger communities
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-center">
            {partnerships.map((partner) =>
            <div key={partner.id} className="text-center">
                <div className="bg-card rounded-civic p-6 civic-shadow border border-border hover:civic-shadow-lg civic-transition">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <AppImage
                    src={partner.logo}
                    alt={partner.logoAlt}
                    className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 civic-transition" />

                  </div>
                  <div className="text-sm font-medium text-foreground">{partner.name}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-card rounded-civic-lg px-8 py-4 civic-shadow border border-border">
            <div className="flex items-center space-x-2">
              <Icon name="ShieldCheckIcon" size={24} className="text-success" />
              <span className="text-sm font-medium text-foreground">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="LockClosedIcon" size={24} className="text-primary" />
              <span className="text-sm font-medium text-foreground">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="DocumentCheckIcon" size={24} className="text-accent" />
              <span className="text-sm font-medium text-foreground">GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default SocialProofSection;
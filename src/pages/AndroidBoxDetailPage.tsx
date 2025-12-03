import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { AndroidBox, AdminData } from '../types';
import { 
  Monitor, 
  MessageCircle, 
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Cpu,
  Wifi,
  Star,
  Shield,
  Zap,
  Smartphone,
  ExternalLink,
  Share2
} from 'lucide-react';

interface AndroidBoxDetailPageProps {
  boxes: AndroidBox[];
  adminData: AdminData;
  onAdminClick: () => void;
}

const AndroidBoxDetailPage: React.FC<AndroidBoxDetailPageProps> = ({
  boxes,
  adminData,
  onAdminClick
}) => {
  const { id } = useParams<{ id: string }>();
  const box = boxes.find(b => b.id === id);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/21655338664', '_blank');
  };

  const handlePurchase = () => {
    if (box?.purchase_url && box.purchase_url.trim() !== '') {
      try {
        const url = new URL(box.purchase_url);
        window.open(box.purchase_url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        window.open('https://wa.me/21655338664', '_blank', 'noopener,noreferrer');
      }
    } else {
      window.open('https://wa.me/21655338664', '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = async () => {
    if (navigator.share && box) {
      try {
        await navigator.share({
          title: `${box.name} - ${adminData.service_name}`,
          text: `Check out this premium Android TV box: ${box.name} - ${box.price}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // If box not found, redirect to boxes page
  if (!box) {
    return <Navigate to="/android-boxes" replace />;
  }

  // Parse specifications into features array
  const features = box.specifications 
    ? box.specifications.split(',').map(spec => spec.trim()).filter(spec => spec.length > 0)
    : [];

  // Related boxes (exclude current box)
  const relatedBoxes = boxes.filter(b => b.id !== box.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <SEOHead 
        title={`${box.name} - Premium Android TV Box | ${adminData.service_name}`}
        description={`${box.name} - ${box.description || 'Premium Android TV box'} - ${box.price}. ${box.specifications || 'High-performance streaming device'} Available in Tunisia with 24/7 support.`}
        keywords={`${box.name}, Android TV Box Tunisia, ${box.price}, 4K streaming, Android box, TechnSat, premium streaming device`}
      />
      
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,165,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,69,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,140,0,0.1),transparent_50%)]"></div>
      </div>

      <Header onAdminClick={onAdminClick} serviceName={adminData.service_name} />
      
      {/* Breadcrumb */}
      <section className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/android-boxes" className="hover:text-white transition-colors">Android TV Boxes</Link>
          <span>/</span>
          <span className="text-orange-400">{box.name}</span>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5 border border-white/10">
              <img 
                src={box.image_url} 
                alt={box.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=800';
                }}
              />
              
              {/* Availability Badge */}
              <div className="absolute top-4 right-4">
                {box.is_available ? (
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 px-3 py-2 rounded-full text-sm flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>In Stock</span>
                  </div>
                ) : (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-400 px-3 py-2 rounded-full text-sm flex items-center space-x-2">
                    <XCircle className="w-4 h-4" />
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                <Monitor className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <span className="text-xs text-gray-300">4K HDR</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                <Wifi className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <span className="text-xs text-gray-300">WiFi</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                <Cpu className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <span className="text-xs text-gray-300">Android</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-3 text-center border border-white/10">
                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <span className="text-xs text-gray-300">Premium</span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {box.name}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-orange-400">{box.price}</div>
                    <button
                      onClick={handleShare}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
                      title="Share this product"
                    >
                      <Share2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {box.description && (
                <p className="text-lg text-gray-300 leading-relaxed">
                  {box.description}
                </p>
              )}
            </div>

            {/* Specifications */}
            {features.length > 0 && (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <span>Technical Specifications</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Benefits */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Why Choose This Box?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">High Performance</h4>
                    <p className="text-gray-400 text-sm">Smooth 4K streaming with minimal buffering</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500/20 p-2 rounded-lg border border-green-500/30">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Reliable & Secure</h4>
                    <p className="text-gray-400 text-sm">Enterprise-grade security and stability</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500/20 p-2 rounded-lg border border-orange-500/30">
                    <Smartphone className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">24/7 Support</h4>
                    <p className="text-gray-400 text-sm">Round-the-clock customer assistance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-md rounded-2xl border border-orange-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Ready to Order?</h3>
                  <p className="text-gray-300 text-sm">Get your premium Android TV box today</p>
                </div>
                <div className="text-2xl font-bold text-orange-400">{box.price}</div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handlePurchase}
                  disabled={!box.is_available}
                  className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg transform hover:scale-105 border ${
                    box.is_available
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white hover:shadow-orange-500/25 border-orange-500/30'
                      : 'bg-gray-600/20 text-gray-500 cursor-not-allowed border-gray-500/30'
                  }`}
                >
                  {box.is_available ? (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Buy Now - {box.price}</span>
                      <ExternalLink className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>Currently Out of Stock</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Ask Questions on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedBoxes.length > 0 && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBoxes.map((relatedBox) => (
                <Link
                  key={relatedBox.id}
                  to={`/android-boxes/${relatedBox.id}`}
                  className="group bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-orange-400/30 transition-all duration-300 transform hover:scale-105 hover:bg-white/10 overflow-hidden"
                >
                  <div className="relative h-40 overflow-hidden rounded-t-xl">
                    <img 
                      src={relatedBox.image_url} 
                      alt={relatedBox.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                    <div className="absolute bottom-2 left-2">
                      <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-400 px-2 py-1 rounded-lg font-bold text-sm">
                        {relatedBox.price}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors duration-200 mb-1">
                      {relatedBox.name}
                    </h3>
                    {relatedBox.description && (
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {relatedBox.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <Link
            to="/android-boxes"
            className="inline-flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Android Boxes</span>
          </Link>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-500 hover:bg-green-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-green-500/25 transform hover:scale-110 transition-all duration-200 z-40 border border-green-500/30"
        title="Contact TechnSat on WhatsApp"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

export default AndroidBoxDetailPage;
"use client"

import * as React from "react"
import { Card, CardContent } from "./card"
import { Cloud, CloudRain, Snowflake, Loader2, MapPin, RefreshCw, Sun, Moon, CloudLightning, CloudFog as CloudMist, Thermometer } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type WeatherType = 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'mist' | 'unknown'

export interface WeatherData {
  city: string
  temperature: number
  weatherType: WeatherType
  dateTime: string
  isDay: boolean
}

export interface WeatherApiResponse {
  name: string
  main: {
    temp: number
  }
  weather: Array<{
    main: string
    icon: string
  }>
}

export interface WeatherWidgetProps {
  /**
   * API key for OpenWeather API
   */
  apiKey?: string
  /**
   * Custom fetch function (optional)
   */
  onFetchWeather?: (lat: number, lng: number) => Promise<WeatherData>
  /**
   * Refresh interval in milliseconds (default: 15 minutes)
   */
  refreshInterval?: number
  /**
   * Width of the widget (default: 16rem/256px)
   */
  width?: string
  /**
   * Custom location coordinates (optional)
   */
  location?: {
    latitude: number
    longitude: number
  }
  /**
   * Fallback location coordinates if geolocation fails
   */
  fallbackLocation?: {
    latitude: number
    longitude: number
  }
  /**
   * Custom CSS class for the card
   */
  className?: string
  /**
   * Callback when weather data is loaded
   */
  onWeatherLoaded?: (data: WeatherData) => void
  /**
   * Callback on error
   */
  onError?: (error: string) => void
  /**
   * Enable/disable animations (default: true)
   */
  animated?: boolean
}

/**
 * Maps weather condition strings to standardized weather types
 * @param condition - The weather condition string from API
 * @returns Standardized weather type
 */
const mapWeatherType = (condition: string): WeatherType => {
  const main = condition.toLowerCase()
  if (main.includes('clear')) return 'clear'
  if (main.includes('cloud')) return 'clouds'
  if (main.includes('rain') || main.includes('drizzle')) return 'rain'
  if (main.includes('snow')) return 'snow'
  if (main.includes('thunder')) return 'thunderstorm'
  if (main.includes('mist') || main.includes('fog') || main.includes('haze')) return 'mist'
  return 'unknown'
}

// Animation variants for different weather types
const weatherAnimations = {
  // Container animation with staggered children
  container: {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  // Standard animation for most elements
  item: {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15
      }
    }
  },
  // Continuous rotation animation
  rotate: {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 20,
        ease: "linear"
      }
    }
  },
  // Subtle pulsing effect for sun/moon
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "easeInOut"
      }
    }
  },
  // Rain droplet animation
  rain: {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: [0, 1, 0],
      y: [0, 20],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      }
    }
  },
  // Snowflake animation with horizontal drift
  snow: (i: number) => ({
    initial: { opacity: 0, y: -5 },
    animate: {
      opacity: [0, 1, 0],
      y: [0, 15],
      x: [0, (i % 2 === 0 ? 5 : -5), 0],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut",
        delay: i * 0.2
      }
    }
  }),
  // Lightning flash animation
  lightning: {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 0.5, 1, 0],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut",
        times: [0, 0.1, 0.2, 0.21, 0.3],
        repeatDelay: 1.5
      }
    }
  },
  // Mist/fog drifting animation
  mist: {
    initial: { opacity: 0.3, x: -20 },
    animate: {
      opacity: [0.3, 0.6, 0.3],
      x: [-20, 20, -20],
      transition: {
        repeat: Infinity,
        duration: 8,
        ease: "easeInOut"
      }
    }
  }
}

// Animation components for each weather type
const AnimatedWeatherIcons = {
    clear: ({ isDay }: { isDay: boolean }) => (
      <motion.div 
        variants={weatherAnimations.item}
        className="relative"
      >
        {isDay ? (
          <motion.div 
            animate={weatherAnimations.rotate.animate}
            className="text-primary"
            aria-label="Clear day"
          >
            <Sun className="h-8 w-8 text-amber-400 dark:text-amber-300" />
            <motion.div 
              className="absolute inset-0"
              animate={weatherAnimations.pulse.animate}
            >
              <Sun className="h-8 w-8 text-amber-400 dark:text-amber-300" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            animate={weatherAnimations.pulse.animate}
            className="text-primary-foreground"
            aria-label="Clear night"
          >
            <Moon className="h-8 w-8 text-slate-300 dark:text-slate-200" />
          </motion.div>
        )}
      </motion.div>
    ),
    
    clouds: () => (
      <motion.div 
        variants={weatherAnimations.item}
        className="relative"
        aria-label="Cloudy weather"
      >
        <Cloud className="h-8 w-8 text-slate-500 dark:text-slate-300" />
        <motion.div 
          className="absolute -left-3 top-1"
          animate={{
            x: [0, 3, 0],
            transition: { repeat: Infinity, duration: 4, ease: "easeInOut" }
          }}
        >
          <Cloud className="h-6 w-6 text-slate-400/70 dark:text-slate-400/80" />
        </motion.div>
      </motion.div>
    ),
    
    rain: () => (
      <motion.div 
        variants={weatherAnimations.item}
        className="relative"
        aria-label="Rainy weather"
      >
        <CloudRain className="h-8 w-8 text-blue-400 dark:text-blue-300" />
        <div className="absolute bottom-0 left-1 right-1 h-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 bg-blue-400 dark:bg-blue-300 w-[2px] h-[7px] rounded-full opacity-0"
              style={{ left: `${25 + i * 20}%` }}
              variants={weatherAnimations.rain}
              animate="animate"
              initial="initial"
              custom={i}
            />
          ))}
        </div>
      </motion.div>
    ),
    
    snow: () => (
      <motion.div 
        variants={weatherAnimations.item}
        className="relative"
        aria-label="Snowy weather"
      >
        <Snowflake className="h-8 w-8 text-blue-300 dark:text-blue-200" />
        <div className="absolute bottom-0 left-0 right-0 h-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 bg-blue-300 dark:bg-blue-200 w-[3px] h-[3px] rounded-full opacity-0"
              style={{ left: `${25 + i * 20}%` }}
              variants={weatherAnimations.snow(i)}
              animate="animate"
              initial="initial"
              custom={i}
            />
          ))}
        </div>
      </motion.div>
    ),
    
    thunderstorm: () => (
      <motion.div 
        variants={weatherAnimations.item}
        className="relative"
        aria-label="Thunderstorm weather"
      >
        <CloudLightning className="h-8 w-8 text-amber-400 dark:text-amber-300" />
        <motion.div
          className="absolute inset-0"
          variants={weatherAnimations.lightning}
          animate="animate"
          initial="initial"
        >
          <CloudLightning className="h-8 w-8 text-amber-300 dark:text-amber-200" />
        </motion.div>
      </motion.div>
    ),
    
    mist: () => (
      <motion.div 
        variants={weatherAnimations.item}
        className="relative"
        aria-label="Misty weather"
      >
        <CloudMist className="h-8 w-8 text-slate-400 dark:text-slate-300" />
        <motion.div
          className="absolute inset-0 opacity-30"
          variants={weatherAnimations.mist}
          animate="animate"
          initial="initial"
        >
          <CloudMist className="h-8 w-8 text-slate-400 dark:text-slate-300" />
        </motion.div>
      </motion.div>
    ),
    
    unknown: () => (
      <motion.div 
        variants={weatherAnimations.item}
        aria-label="Unknown weather condition"
      >
        <Thermometer className="h-8 w-8 text-slate-500 dark:text-slate-300" />
      </motion.div>
    )
  }

/**
 * Get the appropriate weather icon based on type, time of day, and animation preference
 * @param type - Weather type
 * @param isDay - Whether it's daytime
 * @param animated - Whether animations are enabled
 * @returns React component for the weather icon
 */
const getWeatherIcon = (type: WeatherType, isDay: boolean, animated: boolean): React.ReactNode => {
  if (animated) {
    const IconComponent = AnimatedWeatherIcons[type]
    return <IconComponent isDay={isDay} />
  }
  
  // Fallback to static icons if animations are disabled
  switch (type) {
    case 'clear':
      return isDay 
        ? <Sun className="h-8 w-8 text-amber-400 dark:text-amber-300" aria-label="Clear day" /> 
        : <Moon className="h-8 w-8 text-slate-300 dark:text-slate-200" aria-label="Clear night" />
    case 'clouds':
      return <Cloud className="h-8 w-8 text-slate-500 dark:text-slate-300" aria-label="Cloudy weather" />
    case 'rain':
      return <CloudRain className="h-8 w-8 text-blue-400 dark:text-blue-300" aria-label="Rainy weather" />
    case 'snow':
      return <Snowflake className="h-8 w-8 text-blue-300 dark:text-blue-200" aria-label="Snowy weather" />
    case 'thunderstorm':
      return <CloudLightning className="h-8 w-8 text-amber-400 dark:text-amber-300" aria-label="Thunderstorm weather" />
    case 'mist':
      return <CloudMist className="h-8 w-8 text-slate-400 dark:text-slate-300" aria-label="Misty weather" />
    default:
      return <Thermometer className="h-8 w-8 text-slate-500 dark:text-slate-300" aria-label="Unknown weather condition" />
  }
}

/**
 * Loading skeleton for the weather widget
 */
const WeatherSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex justify-between items-center mb-2">
      <div className="bg-secondary/30 h-8 w-8 rounded-full"></div>
      <div className="bg-secondary/30 h-6 w-6 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="bg-secondary/30 h-10 w-16 rounded-md"></div>
      <div className="flex items-center">
        <div className="bg-secondary/30 h-3 w-4 rounded-sm mr-1"></div>
        <div className="bg-secondary/30 h-3 w-20 rounded-sm"></div>
      </div>
      <div className="bg-secondary/30 h-3 w-32 rounded-sm"></div>
    </div>
  </div>
)

export function WeatherWidget({
  apiKey,
  onFetchWeather,
  refreshInterval = 15 * 60 * 1000,
  width = "16rem",
  location,
  fallbackLocation,
  className = "",
  onWeatherLoaded,
  onError,
  animated = true
}: WeatherWidgetProps) {
  const [weather, setWeather] = React.useState<WeatherData | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [initialLoad, setInitialLoad] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshing, setRefreshing] = React.useState<boolean>(false)
  const [isRefreshingDebounced, setIsRefreshingDebounced] = React.useState<boolean>(false)
  const [locationRequested, setLocationRequested] = React.useState<boolean>(false)
  const [permissionStatus, setPermissionStatus] = React.useState<PermissionState | null>(null)

  // Debounced refresh button handler
  const handleRefreshClick = React.useCallback(() => {
    if (isRefreshingDebounced) return;
    
    setIsRefreshingDebounced(true);
    setLocationRequested(true);
    getUserLocation();
    
    // Prevent multiple clicks for 1 second
    setTimeout(() => setIsRefreshingDebounced(false), 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshingDebounced]);

  const fetchWeather = React.useCallback(async (latitude: number, longitude: number) => {
    setRefreshing(true)
    try {
      let weatherData: WeatherData

      if (onFetchWeather) {
        // Use custom fetch function if provided
        weatherData = await onFetchWeather(latitude, longitude)
      } else {
        if (!apiKey) {
          throw new Error("API key is required when custom fetch function is not provided")
        }

        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        )

        if (!response.ok) {
          const statusCode = response.status;
          if (statusCode === 401) {
            throw new Error("Invalid API key. Please check your OpenWeather API credentials")
          } else if (statusCode === 404) {
            throw new Error("Location not found. Please try different coordinates")
          } else if (statusCode === 429) {
            throw new Error("API call limit exceeded. Please try again later")
          } else {
            throw new Error(`Weather API error (${statusCode}): ${response.statusText}`)
          }
        }

        const data: WeatherApiResponse = await response.json()

        const now = new Date()
        const formattedDateTime = new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }).format(now)

        // Check if it's day or night from icon code (icon codes ending with 'd' are day)
        const isDay = data.weather[0].icon.includes('d')

        weatherData = {
          city: data.name,
          temperature: Math.round(data.main.temp),
          weatherType: mapWeatherType(data.weather[0].main),
          dateTime: formattedDateTime,
          isDay
        }
      }

      setWeather(weatherData)
      onWeatherLoaded?.(weatherData)
      
      // Announce to screen readers that weather has been updated
      const announceElement = document.getElementById('weather-update-announcement');
      if (announceElement) {
        announceElement.textContent = `Weather updated for ${weatherData.city}: ${weatherData.temperature} degrees, ${weatherData.weatherType} conditions`;
      }
      
    } catch (err) {
      console.error('Error fetching weather:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
      setInitialLoad(false)
      setRefreshing(false)
    }
  }, [apiKey, onFetchWeather, onWeatherLoaded, onError])

  // Check permission status
  const checkPermissionStatus = React.useCallback(async () => {
    if (!("permissions" in navigator)) return null;
    
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setPermissionStatus(result.state);
      return result.state;
    } catch (err) {
      console.error('Error checking permission status:', err);
      return null;
    }
  }, []);

  const getUserLocation = React.useCallback(async () => {
    if (location) {
      fetchWeather(location.latitude, location.longitude);
      return;
    }

    // If we haven't explicitly requested location yet, don't proceed with geolocation
    if (!locationRequested && initialLoad) {
      setLoading(false);
      setError("Click 'Get Weather' to access your location");
      return;
    }

    // Check permission status if available
    const permState = await checkPermissionStatus();
    
    if (permState === 'denied') {
      // If permission is denied and we have fallback location, use it
      if (fallbackLocation) {
        fetchWeather(fallbackLocation.latitude, fallbackLocation.longitude);
        return;
      }
      
      setError("Location access denied. Please enable location services in your browser settings");
      setLoading(false);
      return;
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          fetchWeather(position.coords.latitude, position.coords.longitude)
        },
        (geoError) => {
          let errorMessage = "Unable to retrieve your location";
          
          // Provide more specific error messages based on GeolocationPositionError
          if (geoError.code === 1) {
            // Permission denied - try fallback if available
            if (fallbackLocation) {
              fetchWeather(fallbackLocation.latitude, fallbackLocation.longitude);
              return;
            }
            errorMessage = "Location access denied. Please enable location services in your browser settings";
          } else if (geoError.code === 2) {
            errorMessage = "Location unavailable. Please try again later";
          } else if (geoError.code === 3) {
            errorMessage = "Location request timed out. Please try again";
          }
          
          setError(errorMessage)
          setLoading(false)
          setInitialLoad(false)
          onError?.(errorMessage)
        },
        { 
          enableHighAccuracy: false, 
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      const errorMessage = "Geolocation is not supported by your browser"
      setError(errorMessage)
      setLoading(false)
      setInitialLoad(false)
      onError?.(errorMessage)
    }
  }, [fetchWeather, location, fallbackLocation, onError, locationRequested, initialLoad, checkPermissionStatus]);

  const requestLocationAccess = () => {
    setLocationRequested(true);
    setLoading(true);
    setError(null);
    getUserLocation();
  };

  React.useEffect(() => {
    // Check permission status on component mount
    checkPermissionStatus();
    
    // Initial location fetch (won't actually request location unless we have one explicitly set)
    getUserLocation();
    
    // Only set up the refresh interval if we have explicit location or user has requested it
    if (location || locationRequested) {
      const interval = setInterval(() => {
        if (location || locationRequested) {
          getUserLocation();
        }
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [checkPermissionStatus, getUserLocation, location, locationRequested, refreshInterval]);

  return (
    <Card 
      className={`overflow-hidden rounded-xl border-none shadow-lg bg-gradient-to-br from-background/90 to-muted/90 backdrop-blur ${className}`}
      style={{ width }}
      role="region"
      aria-live="polite"
      aria-atomic="true"
      aria-label="Weather information"
    >
      {/* Hidden element for screen reader announcements */}
      <div id="weather-update-announcement" className="sr-only" aria-live="assertive"></div>
      
      <CardContent className="p-4 text-foreground">
        <AnimatePresence mode="wait">
          {loading ? (
            initialLoad ? (
              // Show skeleton on initial load
              <motion.div 
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <WeatherSkeleton />
              </motion.div>
            ) : (
              // Show spinner for subsequent loads
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center p-4"
                aria-label="Loading weather data"
              >
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </motion.div>
            )
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 text-center"
              role="alert"
            >
              <p className="text-sm text-destructive mb-2">{error}</p>
              
              {error.includes("Click 'Get Weather'") ? (
                <button 
                  onClick={requestLocationAccess}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 py-2"
                  aria-label="Allow location access"
                  disabled={isRefreshingDebounced}
                >
                  Get Weather
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleRefreshClick}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2"
                    aria-label="Refresh weather data"
                    disabled={isRefreshingDebounced}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    <span>Try Again</span>
                  </button>
                  
                  {error.includes("Location access denied") && permissionStatus === 'denied' && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-2">
                        Your browser is currently blocking location access. You may need to reset permissions in your browser settings.
                      </p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ) : weather && (
            <motion.div
              key="weather"
              variants={animated ? weatherAnimations.container : undefined}
              initial={animated ? "hidden" : undefined}
              animate={animated ? "show" : undefined}
              exit={{ opacity: 0 }}
              aria-label={`Current weather in ${weather.city}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-3xl">
                  {getWeatherIcon(weather.weatherType, weather.isDay, animated)}
                </div>
                <motion.button 
                  variants={weatherAnimations.item}
                  onClick={handleRefreshClick}
                  className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Refresh weather data"
                  disabled={refreshing || isRefreshingDebounced}
                >
                  <motion.div
                    animate={refreshing ? { rotate: 360 } : {}}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw size={16} />
                  </motion.div>
                </motion.button>
              </div>
              <div className="space-y-1">
                <motion.div 
                  variants={weatherAnimations.item}
                  className="text-4xl font-extralight"
                  initial={animated ? { scale: 0.9, opacity: 0 } : undefined}
                  animate={animated ? { scale: 1, opacity: 1 } : undefined}
                  transition={{ type: "spring", damping: 10 }}
                  aria-label={`Temperature: ${weather.temperature} degrees celsius`}
                >
                  {weather.temperature}<span className="text-2xl">°</span>
                </motion.div>
                <motion.div 
                  variants={weatherAnimations.item}
                  className="flex items-center text-xs text-muted-foreground"
                >
                  <MapPin size={12} className="mr-1" aria-hidden="true" />
                  <span>{weather.city}</span>
                </motion.div>
                <motion.div 
                  variants={weatherAnimations.item}
                  className="text-xs text-muted-foreground"
                >
                  {weather.dateTime}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
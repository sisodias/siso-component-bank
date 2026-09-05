import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RotateCcw, Copy, LinkIcon, CheckIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner'

const LinkShortenerWidget = () => {
  const [longLink, setLongLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = useCallback((url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  // Simulates an API call to a link shortening service
  const simulateShortenLink = useCallback(async (link: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const uniqueCode = Math.random().toString(36).substring(2, 8);
        resolve(`https://short.url/${uniqueCode}`); // Dummy short URL
      }, 1500); // Simulate network delay
    });
  }, []);

  const handleShorten = async () => {
    setError(null);
    setIsCopied(false);
    setShortLink(''); // Clear previous short link

    if (!longLink.trim()) {
      setError('Please enter a link to shorten.');
      return;
    }

    if (!isValidUrl(longLink)) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }

    setIsLoading(true);
    try {
      const generatedShortLink = await simulateShortenLink(longLink);
      setShortLink(generatedShortLink);
      toast.success('Link Shortened!', {
        description: 'Your link has been successfully shortened.',
      });
    } catch (err) {
      setError('Failed to shorten link. Please try again.');
      toast.error('Error', {
        description: 'Failed to shorten link. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortLink) {
      try {
        await navigator.clipboard.writeText(shortLink);
        setIsCopied(true);
        toast.success('Copied!', {
          description: 'Short link copied to clipboard.',
        });
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy short link: ', err);
        toast.error('Copy Failed', {
          description: 'Could not copy link to clipboard.',
        });
      }
    }
  };

  const handleRestart = () => {
    setLongLink('');
    setShortLink('');
    setIsCopied(false);
    setError(null);
  };

  // Framer Motion Variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const resultVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut', delay: 0.1 } },
    exit: { opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const errorVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2, ease: 'easeIn' } },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="max-w-md w-full mx-auto p-4"
    >
      <Card className="shadow-lg border-primary/20 bg-background/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2 text-primary">
            <LinkIcon className="h-7 w-7" />
            Link Shortener
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="long-link" className="text-muted-foreground">
                Enter your long URL
              </Label>
              <Input
                id="long-link"
                type="url"
                placeholder="https://www.google.com/search?q=very+long+url+example"
                value={longLink}
                onChange={(e) => {
                  setLongLink(e.target.value);
                  setError(null);
                }}
                className={`transition-all duration-200 ${
                  error
                    ? 'border-destructive focus-visible:ring-destructive'
                    : 'focus-visible:ring-primary'
                }`}
                disabled={isLoading}
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    className="text-destructive text-sm mt-1"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <Button
              onClick={handleShorten}
              className="w-full relative h-10 overflow-hidden"
              disabled={isLoading || !longLink.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center absolute inset-0 justify-center"
                  >
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Shortening...
                  </motion.span>
                ) : (
                  <motion.span
                    key="shorten"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center absolute inset-0 justify-center"
                  >
                    Shorten Link
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            <AnimatePresence>
              {shortLink && (
                <motion.div
                  variants={resultVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4 pt-4 border-t border-dashed border-border mt-5"
                >
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="short-link" className="text-muted-foreground">
                      Your Shortened Link
                    </Label>
                    <div className="relative">
                      <Input
                        id="short-link"
                        type="text"
                        value={shortLink}
                        readOnly
                        className="pr-12 bg-muted/50 font-mono text-primary select-text cursor-text"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                        onClick={handleCopy}
                        aria-label="Copy short link"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <AnimatePresence mode="wait">
                          {isCopied ? (
                            <motion.span
                              key="copied-icon"
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CheckIcon className="h-4 w-4 text-green-500" />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="copy-icon"
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Copy className="h-4 w-4" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleRestart}
                    variant="outline"
                    className="w-full text-muted-foreground hover:text-primary hover:border-primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Shorten Another Link
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LinkShortenerWidget;

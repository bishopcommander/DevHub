package com.devhub.service;

import com.devhub.dto.LandingResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class LandingService {

    public LandingResponse getLandingData() {
        return new LandingResponse(
            "Build better coding habits. Ship faster with calm focus.",
            "DevHub blends AI guidance, flow analytics, and gamified momentum so your best coding days become your default.",
            "Start Coding Smarter",
            List.of(
                new LandingResponse.FeatureItem("AI Code Explainer", "Understand complex snippets in seconds with plain-language walkthroughs and edge-case callouts.", "spark"),
                new LandingResponse.FeatureItem("Dev Tracker", "Track coding time, focus blocks, and streak consistency to build better coding habits.", "clock"),
                new LandingResponse.FeatureItem("Dev Bingo", "Turn deep work into a game with daily board challenges designed for meaningful progress.", "grid"),
                new LandingResponse.FeatureItem("Mood Music", "Match your workflow with focus playlists and ambient tracks that keep you in the zone.", "music")
            ),
            List.of(
                new LandingResponse.TestimonialItem("Anika Patel", "Frontend Engineer at LayerStack", "DevHub turned my scattered coding sessions into clear momentum. My streak has never been this consistent."),
                new LandingResponse.TestimonialItem("Jordan Lee", "Indie Hacker", "The AI explainer plus tracker combo helps me ship faster while understanding every line I write."),
                new LandingResponse.TestimonialItem("Marcus Dunn", "CS Student", "Dev Bingo keeps me accountable and surprisingly makes practice feel fun again.")
            ),
            List.of(
                new LandingResponse.PricingTier("Free", "$0", "Great for getting started", List.of("Basic AI explanations", "Weekly coding stats", "1 bingo board template", "Standard music presets")),
                new LandingResponse.PricingTier("Pro", "$12/mo", "For focused developers and teams", List.of("Unlimited AI explanations", "Advanced tracker analytics", "Custom bingo boards", "Spotify-powered music modes"))
            ),
            List.of(
                Map.of("label", "Hours Coded", "value", "42h"),
                Map.of("label", "Current Streak", "value", "11 days"),
                Map.of("label", "Tasks Closed", "value", "27")
            )
        );
    }
}

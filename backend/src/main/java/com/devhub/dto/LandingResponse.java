package com.devhub.dto;

import java.util.List;
import java.util.Map;

public record LandingResponse(
    String heroHeadline,
    String heroSubheading,
    String heroCta,
    List<FeatureItem> features,
    List<TestimonialItem> testimonials,
    List<PricingTier> pricing,
    List<Map<String, String>> previewStats
) {
    public record FeatureItem(String title, String description, String icon) {}
    public record TestimonialItem(String name, String role, String quote) {}
    public record PricingTier(String tier, String price, String description, List<String> features) {}
}

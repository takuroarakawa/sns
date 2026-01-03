import 'package:flutter/material.dart';
import '../models/plot.dart';

class PlotDisplay extends StatelessWidget {
  final PlotStructure plot;
  final String originalAbstract;
  final int processingTimeMs;

  const PlotDisplay({
    Key? key,
    required this.plot,
    required this.originalAbstract,
    required this.processingTimeMs,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildHeader(context),
          const SizedBox(height: 20),
          _buildPlotSection(
            context,
            title: '起 (Ki) - Introduction',
            content: plot.ki,
            color: Colors.blue,
            icon: Icons.auto_stories,
          ),
          const SizedBox(height: 16),
          _buildPlotSection(
            context,
            title: '承 (Sho) - Development',
            content: plot.sho,
            color: Colors.orange,
            icon: Icons.trending_up,
          ),
          const SizedBox(height: 16),
          _buildPlotSection(
            context,
            title: '転 (Ten) - Twist',
            content: plot.ten,
            color: Colors.purple,
            icon: Icons.flash_on,
          ),
          const SizedBox(height: 16),
          _buildPlotSection(
            context,
            title: '結 (Ketsu) - Conclusion',
            content: plot.ketsu,
            color: Colors.green,
            icon: Icons.celebration,
          ),
          const SizedBox(height: 20),
          _buildFooter(context),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.science, color: Theme.of(context).primaryColor),
                const SizedBox(width: 8),
                Text(
                  'Original Abstract',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              originalAbstract,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey[700],
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlotSection(
    BuildContext context, {
    required String title,
    required String content,
    required Color color,
    required IconData icon,
  }) {
    return Card(
      elevation: 3,
      color: color.withOpacity(0.1),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 28),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: color,
                        ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              content,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    height: 1.6,
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFooter(BuildContext context) {
    return Card(
      elevation: 1,
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.speed, size: 16, color: Colors.grey[600]),
            const SizedBox(width: 8),
            Text(
              'Processed in ${processingTimeMs}ms',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey[600],
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

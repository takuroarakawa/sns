import 'package:flutter/material.dart';
import '../models/plot.dart';
import '../services/api_service.dart';
import '../widgets/plot_display.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _paperTextController = TextEditingController();
  final TextEditingController _authorNameController = TextEditingController();
  final ApiService _apiService = ApiService();
  
  bool _isLoading = false;
  TransformResponse? _result;
  String? _errorMessage;

  @override
  void dispose() {
    _paperTextController.dispose();
    _authorNameController.dispose();
    super.dispose();
  }

  Future<void> _transformPaper() async {
    if (_paperTextController.text.trim().isEmpty) {
      setState(() {
        _errorMessage = 'Please enter your paper text';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _result = null;
    });

    try {
      final request = TransformRequest(
        paperText: _paperTextController.text.trim(),
        authorName: _authorNameController.text.trim().isEmpty
            ? null
            : _authorNameController.text.trim(),
      );

      final response = await _apiService.transformPaper(request);

      setState(() {
        _result = response;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Error: $e';
        _isLoading = false;
      });
    }
  }

  void _clearForm() {
    setState(() {
      _paperTextController.clear();
      _authorNameController.clear();
      _result = null;
      _errorMessage = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Doctor Canvas'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          if (_result != null)
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _clearForm,
              tooltip: 'New transformation',
            ),
        ],
      ),
      body: _result == null ? _buildInputForm() : _buildResultView(),
    );
  }

  Widget _buildInputForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.auto_awesome,
                        color: Theme.of(context).primaryColor,
                        size: 32,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Transform Your Paper into an Epic Story!',
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Enter your academic paper text below, and we\'ll transform it into an exciting manga-style plot using the kishōtenketsu (起承転結) structure!',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[700],
                        ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          TextField(
            controller: _authorNameController,
            decoration: InputDecoration(
              labelText: 'Author Name (Optional)',
              hintText: 'Dr. Smith',
              prefixIcon: const Icon(Icons.person),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          const SizedBox(height: 16),
          TextField(
            controller: _paperTextController,
            maxLines: 12,
            decoration: InputDecoration(
              labelText: 'Paper Text *',
              hintText: 'Paste your academic paper text here...\n\nInclude the abstract, methodology, findings, and conclusions for best results.',
              alignLabelWithHint: true,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          const SizedBox(height: 24),
          if (_errorMessage != null)
            Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.red[50],
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.red[300]!),
              ),
              child: Row(
                children: [
                  Icon(Icons.error_outline, color: Colors.red[700]),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _errorMessage!,
                      style: TextStyle(color: Colors.red[700]),
                    ),
                  ),
                ],
              ),
            ),
          ElevatedButton(
            onPressed: _isLoading ? null : _transformPaper,
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: _isLoading
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.auto_fix_high),
                      SizedBox(width: 8),
                      Text(
                        'Transform to Epic Plot!',
                        style: TextStyle(fontSize: 16),
                      ),
                    ],
                  ),
          ),
          const SizedBox(height: 16),
          Center(
            child: Text(
              'Powered by Rust + Flutter',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey[600],
                  ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResultView() {
    if (_result == null) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: PlotDisplay(
        plot: _result!.plot,
        originalAbstract: _result!.originalAbstract,
        processingTimeMs: _result!.processingTimeMs,
      ),
    );
  }
}

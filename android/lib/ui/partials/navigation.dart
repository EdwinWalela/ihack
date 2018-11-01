import 'package:flutter/material.dart';

import 'package:afyabora/ui/dashboard.dart';
import 'package:afyabora/ui/diagnoses.dart';
import 'package:afyabora/ui/resources.dart';

class Navigation extends StatefulWidget {
  @override
  _NavigationPage createState() => _NavigationPage();
}

class _NavigationPage extends State<Navigation> {
  int _currentIndex = 0;
  final List<Widget> _children = [
    Dashboard(),
    Diagnoses(),
    Resources()
  ];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Afya Bora')),
      body: _children[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
          onTap: onTabTapped,
          currentIndex: _currentIndex,
          items: [
            BottomNavigationBarItem(
                icon: Icon(Icons.account_circle), title: Text('Profile')),
            BottomNavigationBarItem(
                icon: Icon(Icons.history), title: Text('Medical History')),
            BottomNavigationBarItem(
                icon: Icon(Icons.assignment), title: Text('Resources')),
          ]),
    );
  }

  void onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }
}
